import React from 'react';
import { Calendar, Calculator, PieChart, Settings, LogOut, Layers } from 'lucide-react';

export const Layout = ({ children, activeTab, onViewChange, user, onLogout, isDarkMode, t, theme = { bg: 'bg-emerald-500', text: 'text-emerald-500' } }) => {
  
  const menuItems = [
    { id: 'calendar', icon: Calendar, label: t.calendar },
    { id: 'analytics', icon: PieChart, label: t.analytics },
    { id: 'budget', icon: Calculator, label: t.budget },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden transition-colors duration-300">
      
      <aside className="hidden md:flex w-72 flex-col border-r z-30 transition-colors bg-white dark:bg-[#18181B] border-slate-200 dark:border-white/5 shrink-0">
        <div className="p-6">
          <div 
            onClick={() => onViewChange('dashboard')} 
            className="flex items-center gap-3 mb-10 px-2 mt-2 cursor-pointer group select-none"
          >
            <div className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
              <Layers size={22} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none text-slate-900 dark:text-white group-hover:opacity-80 transition-opacity">SubsTracker</h1>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.text} opacity-80`}>Pro</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => onViewChange(item.id)} 
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm
                  ${activeTab === item.id 
                    ? `${theme.bg} text-white shadow-md` 
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }
                `}
              >
                <item.icon size={20} className={activeTab === item.id ? '' : 'opacity-70'} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="p-3 rounded-2xl flex items-center gap-3 border transition-colors bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5">
            <div className="text-2xl">{user.avatar}</div>
            <div className="overflow-hidden flex-1">
              <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-0.5">{t.welcome}</div>
              <div className="font-bold truncate text-sm text-slate-900 dark:text-white">{user.name}</div>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative scroll-smooth no-scrollbar bg-[#F2F3F5] dark:bg-[#121214] transition-colors">
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 lg:p-10 pb-32 md:pb-10">
          
          <div className="md:hidden flex justify-between items-center mb-6 sticky top-0 z-20 py-4 backdrop-blur-md bg-[#F2F3F5]/90 dark:bg-[#121214]/90">
            <h1 onClick={() => onViewChange('dashboard')} className="text-2xl font-black text-slate-900 dark:text-white cursor-pointer truncate max-w-[200px]">
              {activeTab === 'dashboard' ? t.appName : t[activeTab]}
            </h1>
            <div onClick={onLogout} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xl shrink-0">
              {user.avatar}
            </div>
          </div>

          {children}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 rounded-[2rem] backdrop-blur-xl z-40 flex justify-evenly items-center px-2 shadow-xl border transition-colors bg-white/95 dark:bg-[#1E1E24]/95 border-slate-200 dark:border-white/10">
        <button onClick={() => onViewChange('dashboard')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${activeTab === 'dashboard' ? `${theme.text} bg-current/10` : 'text-slate-500 dark:text-slate-400'}`}>
            <Layers size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
        </button>
        {menuItems.slice(0, 3).map((item) => (
          <button 
            key={item.id} 
            onClick={() => onViewChange(item.id)} 
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${activeTab === item.id ? `${theme.text} bg-current/10` : 'text-slate-500 dark:text-slate-400'}`}
          >
            <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          </button>
        ))}
        <button onClick={() => onViewChange('settings')} className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${activeTab === 'settings' ? `${theme.text} bg-current/10` : 'text-slate-500 dark:text-slate-400'}`}>
          <Settings size={24} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
        </button>
      </nav>

    </div>
  );
};