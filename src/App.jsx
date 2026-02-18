import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw, AlertOctagon } from 'lucide-react'; 
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth';
import { collection, addDoc, deleteDoc, updateDoc, doc, query, where, onSnapshot, writeBatch, getDocs } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { CURRENCIES, APP_THEMES, TRANSLATIONS } from './config/constants.js';
import { convert } from './utils/helpers';

import Auth from './components/Auth';
import SubscriptionModal from './components/SubscriptionModal';
import { Layout } from './components/layout/Layout';
import { Button, ConfirmModal } from './components/ui/Elements';
import Toast from './components/ui/Toast';

import { DashboardView } from './components/views/DashboardView';
import { CalendarView } from './components/views/CalendarView';
import { BudgetView } from './components/views/BudgetView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [lang, setLang] = useState('UA');
  const [currency, setCurrency] = useState('UAH');
  const [region, setRegion] = useState('GLOBAL');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentKey, setAccentKey] = useState('emerald');
  
  const [subs, setSubs] = useState([]);
  const [budget, setBudget] = useState('');

  const [view, setView] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [notification, setNotification] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;
  const theme = APP_THEMES[accentKey] || APP_THEMES.emerald;
  const currencySign = CURRENCIES.find(c => c.code === currency)?.sign || '$';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const demoUser = localStorage.getItem('subs_demo_user');
    if (demoUser) {
        setUser(JSON.parse(demoUser));
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setSubs([]); return; }
    if (user.uid === "demo-user") return;
    
    try {
        const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const subsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setSubs(subsData);
        }, (error) => console.log("Auth/Sync skipped:", error));
        return () => unsubscribe();
    } catch (e) { console.log("Firestore unavailable"); }
  }, [user]);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
  };

  const totalMonthly = useMemo(() => {
    return subs.reduce((acc, s) => {
        const amount = convert(s.period === 'monthly' ? s.price : s.price/12, s.currency, currency);
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [subs, currency]);

  const categoryStats = useMemo(() => {
    const stats = {};
    subs.forEach(s => { 
        const val = convert(s.period === 'monthly' ? s.price : s.price/12, s.currency, currency); 
        const cat = s.category || 'all'; 
        stats[cat] = (stats[cat]||0) + val; 
    });
    return Object.entries(stats)
      .map(([key, val]) => ({ key, val, percent: totalMonthly > 0 ? (val / totalMonthly) * 100 : 0 }))
      .sort((a,b) => b.val - a.val);
  }, [subs, currency, totalMonthly]);

  const crudSub = async (data) => {
    if (!user) return;
    try {
      const price = parseFloat(data.price);
      if (isNaN(price) || price < 0) {
        showNotification("Введіть коректну ціну", 'error');
        return;
      }
      if (!data.name.trim()) {
        showNotification("Введіть назву сервісу", 'error');
        return;
      }

      const subData = { ...data, price, userId: user.uid, updatedAt: new Date().toISOString() };
      
      if (user.uid === "demo-user") {
        const n = {...subData, id: data.id || Date.now().toString()};
        setSubs(prev => data.id ? prev.map(s => s.id === data.id ? n : s) : [...prev, n]);
        showNotification(data.id ? "Підписку оновлено" : "Підписку додано", 'success');
      } else {
        if (data.id) { 
            const { id, ...rest } = subData; 
            await updateDoc(doc(db, "subscriptions", id), rest);
            showNotification("Підписку оновлено", 'success');
        } else { 
            await addDoc(collection(db, "subscriptions"), subData); 
            showNotification("Підписку додано", 'success');
        }
      }
      setIsModalOpen(false);
    } catch (e) { 
        showNotification("Помилка збереження: " + e.message, 'error'); 
    }
  };

  const deleteSubscription = async (id) => {
    if (!user) return;
    if (user.uid === "demo-user") { 
        setSubs(prev => prev.filter(s => s.id !== id)); 
        setIsModalOpen(false); 
        showNotification("Підписку видалено", 'success');
        return; 
    }
    try { 
        await deleteDoc(doc(db, "subscriptions", id)); 
        setIsModalOpen(false); 
        showNotification("Підписку видалено", 'success');
    } catch(e) { 
        console.error(e); 
        showNotification("Помилка видалення", 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('subs_demo_user'); 
    if (user?.uid === "demo-user") setUser(null);
    else signOut(auth);
  };
  
  const handleDeleteAccount = async () => {
    const saved = JSON.parse(localStorage.getItem('subs_known_users') || '[]');
    const newSaved = saved.filter(u => u.email !== user.email);
    localStorage.setItem('subs_known_users', JSON.stringify(newSaved));
    
    if (user?.uid === "demo-user") { 
        setUser(null); 
        setDeleteAccountModal(false); 
        localStorage.removeItem('subs_demo_user'); 
        return; 
    }
    try { 
      const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      await deleteUser(user);
      setDeleteAccountModal(false);
    } catch (error) { 
        showNotification("Помилка. Перезайдіть в акаунт.", 'error'); 
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { 
        try { 
            const d = JSON.parse(ev.target.result); 
            if(d.content?.subs) { 
                setSubs(d.content.subs); 
                setBudget(d.content.budget||''); 
                showNotification("Дані імпортовано успішно", 'success'); 
            } 
        } catch (err) { showNotification("Невірний формат файлу", 'error'); } 
    };
    reader.readAsText(file);
  };

  const exportData = () => {
    const dataStr = JSON.stringify({ user: {email: user.email}, content: { subs, budget } });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([dataStr], { type: "application/json" }));
    link.download = "backup.json"; 
    link.click();
  };

  const jumpToCalendar = (e, sub) => {
    e.stopPropagation();
    const date = new Date(sub.startDate); 
    setCalendarDate(date); 
    setView('calendar');
  };

  if (loading) return <div className="min-h-screen bg-[#313338] text-white flex items-center justify-center font-bold">Loading...</div>;
  if (!user) return <Auth onLogin={(u) => setUser(u)} isDarkMode={isDarkMode} t={t} theme={theme} lang={lang} setLang={setLang} />;

  return (
    <>
        {notification && (
            <Toast 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification(null)} 
            />
        )}
        
        <Layout activeTab={view} onViewChange={setView} user={{name: user.email?.split('@')[0] || 'User', avatar: '😎'}} onLogout={handleLogout} isDarkMode={isDarkMode} t={t} theme={theme}>
        
        {view === 'dashboard' && (
            <DashboardView 
                subs={subs} totalMonthly={totalMonthly} currencySign={currencySign} t={t} theme={theme}
                onEdit={(sub) => { setModalData(sub); setIsModalOpen(true); }}
                searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                filterCat={filterCat} setFilterCat={setFilterCat}
                jumpToCalendar={jumpToCalendar}
                categoryStats={categoryStats}
                currency={currency}
            />
        )}
        
        {view === 'analytics' && (
            <AnalyticsView totalMonthly={totalMonthly} currencySign={currencySign} t={t} theme={theme} categoryStats={categoryStats} />
        )}
        
        {view === 'calendar' && (
            <CalendarView subs={subs} t={t} theme={theme} initialDate={calendarDate} />
        )}
        
        {view === 'budget' && (
            <BudgetView budget={budget} setBudget={setBudget} totalMonthly={totalMonthly} currencySign={currencySign} t={t} theme={theme} />
        )}
        
        {view === 'settings' && (
            <SettingsView 
                t={t} user={user} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
                lang={lang} setLang={setLang} currency={currency} setCurrency={setCurrency}
                accentKey={accentKey} setAccentKey={setAccentKey} handleLogout={handleLogout}
                exportData={exportData} handleImport={handleImport} setDeleteAccountModal={setDeleteAccountModal}
            />
        )}

        <SubscriptionModal 
            isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
            initialData={modalData || {name:'', price:'', currency, period:'monthly', startDate: new Date().toISOString().split('T')[0], color: 'bg-zinc-900', category:'entertainment'}} 
            onSave={crudSub} onDelete={id => deleteSubscription(id)} 
            t={t} theme={theme} isDarkMode={isDarkMode} region={region}
            notify={showNotification} // Передаем функцию уведомлений
        />
        
        <ConfirmModal 
            isOpen={deleteAccountModal} onClose={() => setDeleteAccountModal(false)} 
            onConfirm={handleDeleteAccount} title={t.deleteAcc} message={t.deleteAccConfirm} isDarkMode={isDarkMode} 
        />
        
        </Layout>
    </>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Error:", error, errorInfo); }
  handleRetry = () => { this.setState({ hasError: false }); window.location.href = '/'; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#121214] text-white p-6">
          <div className="max-w-md text-center flex flex-col items-center">
            <AlertOctagon size={64} className="text-rose-500 mb-6" />
            <h1 className="text-3xl font-black mb-2">Oops!</h1>
            <p className="text-slate-400 mb-8">Something went wrong.</p>
            <Button onClick={this.handleRetry} icon={RefreshCw}>Restart App</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => ( <ErrorBoundary> <AppContent /> </ErrorBoundary> );
export default App;