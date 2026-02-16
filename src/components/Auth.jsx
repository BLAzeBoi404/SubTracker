import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, User, UserPlus, X, Key } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase'; 
import { Button, Input, ErrorAlert } from './ui/Elements';
import { AuthLayout } from './ui/AuthLayout';

const Auth = ({ onLogin, isDarkMode, t, theme, lang, setLang }) => {
  const [view, setView] = useState('list'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedUsers, setSavedUsers] = useState([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('subs_known_users') || '[]');
    setSavedUsers(saved);
    if (saved.length === 0) setView('login');
  }, []);

  const saveUserToLocal = (email, pwd) => {
    const saved = JSON.parse(localStorage.getItem('subs_known_users') || '[]');
    const filtered = saved.filter(u => u.email !== email);
    const newUser = { email, password: pwd, avatar: '😎', lastLogin: new Date().toISOString() }; 
    const newSaved = [newUser, ...filtered];
    localStorage.setItem('subs_known_users', JSON.stringify(newSaved));
    setSavedUsers(newSaved);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    await executeLogin(email, password, view === 'register');
  };

  const executeLogin = async (emailToUse, passwordToUse, isRegistration) => {
    setLoading(true);
    setError(null);

    const apiKey = auth?.app?.options?.apiKey;
    if (!apiKey || apiKey === "API_KEY") {
        setTimeout(() => {
            const userEmail = emailToUse || "demo@user.com";
            localStorage.setItem('subs_demo_user', JSON.stringify({ uid: "demo-user", email: userEmail, avatar: '👤' }));
            saveUserToLocal(userEmail, passwordToUse);
            onLogin({ uid: "demo-user", email: userEmail, avatar: '👤' });
            setLoading(false);
        }, 800);
        return;
    }

    try {
      if (isRegistration) {
        await createUserWithEmailAndPassword(auth, emailToUse, passwordToUse);
      } else {
        await signInWithEmailAndPassword(auth, emailToUse, passwordToUse);
      }
      saveUserToLocal(emailToUse, passwordToUse);
    } catch (err) {
      console.error(err);
      let msg = "Authentication failed";
      if (err.code === 'auth/invalid-email') msg = "Invalid Email format";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') msg = "User not found or wrong password";
      if (err.code === 'auth/wrong-password') msg = "Wrong password";
      setError(msg);
      setLoading(false);
    }
  };

  const handleCardClick = (u) => {
    if (u.password) executeLogin(u.email, u.password, false);
    else { setEmail(u.email); setView('login'); }
  };

  const forgetUser = (e, emailToRemove) => {
    e.stopPropagation();
    const newSaved = savedUsers.filter(u => u.email !== emailToRemove);
    localStorage.setItem('subs_known_users', JSON.stringify(newSaved));
    setSavedUsers(newSaved);
    if (newSaved.length === 0) setView('login');
  };

  return (
    <AuthLayout t={t} theme={theme} isDarkMode={isDarkMode} lang={lang} setLang={setLang}>
      {view === 'list' && savedUsers.length > 0 && (
        <div className="animate-fade-in space-y-6 w-full max-w-md mx-auto">
            <div>
                <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">{t.welcome}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t.chooseAcc}</p>
            </div>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                {savedUsers.map(u => (
                    <div key={u.email} onClick={() => handleCardClick(u)} className="group flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-transparent hover:border-emerald-500 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xl shrink-0">{u.avatar}</div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white truncate">{u.email}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1">{u.password ? <span className="text-emerald-500 font-bold flex items-center gap-1"><Key size={12} /> Auto-login</span> : "Password required"}</div>
                        </div>
                        <button onClick={(e) => forgetUser(e, u.email)} className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={20} /></button>
                    </div>
                ))}
            </div>
            {loading && <div className="flex justify-center p-2"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div></div>}
            <Button onClick={() => { setView('login'); setEmail(''); setPassword(''); }} variant="secondary" className="w-full h-16" icon={UserPlus}>{t.addAcc}</Button>
        </div>
      )}

      {view !== 'list' && (
        <form onSubmit={handleAuth} className="animate-fade-in space-y-6 w-full max-w-md mx-auto">
            <div className="mb-8">
            <h2 className="text-4xl font-black mb-3 text-slate-900 dark:text-white">{view === 'login' ? t.login : t.register}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{view === 'login' ? "Welcome back!" : "Create an account."}</p>
            </div>
            {error && <ErrorAlert message={error} />}
            <div className="space-y-4">
                {view === 'register' && <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" type="text" icon={User} required />}
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" icon={Mail} required />
                <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" icon={Lock} required />
            </div>
            <div className="pt-6">
                <Button type="submit" className="w-full text-lg h-16 shadow-xl shadow-emerald-500/20" icon={view === 'login' ? LogIn : null} disabled={loading} theme={theme}>{loading ? "Loading..." : (view === 'login' ? t.loginBtn : t.register)}</Button>
            </div>
            <div className="flex flex-col gap-4 text-center pt-2">
                {savedUsers.length > 0 && <button type="button" onClick={() => setView('list')} className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">{t.back}</button>}
                <button type="button" onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(null); }} className="font-bold text-emerald-500 hover:underline transition-all">{view === 'login' ? t.createAcc : "Already have an account? Login"}</button>
            </div>
        </form>
      )}
    </AuthLayout>
  );
};
export default Auth;