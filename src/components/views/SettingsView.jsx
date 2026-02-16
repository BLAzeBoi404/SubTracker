import React from 'react';
import { Palette, Globe, Wallet, Trash2, LogOut, Download, Upload } from 'lucide-react';
import { Card, Title, Button } from '../ui/Elements';
import CustomSelect from '../ui/CustomSelect';
import { APP_THEMES, LANGUAGES, CURRENCIES } from '../../config/constants';

export const SettingsView = ({ t, user, isDarkMode, setIsDarkMode, lang, setLang, currency, setCurrency, accentKey, setAccentKey, handleLogout, exportData, handleImport, setDeleteAccountModal }) => {
    const currencyOptions = CURRENCIES.map(c => ({ code: c.code, name: t.cur[c.code] || c.code }));
    return (
        <div className="animate-fade-in max-w-3xl mr-auto pb-24 md:pb-0">
            <Title>{t.settings}</Title>
            <div className="mb-8">
                <div className="text-xs font-bold uppercase opacity-60 mb-4 ml-1 tracking-widest text-slate-700 dark:text-white">{t.theme}</div>
                <Card className="space-y-6">
                    <div>
                        <label className="text-xs font-bold opacity-60 mb-3 block text-slate-800 dark:text-slate-300">{t.color}</label>
                        <div className="flex gap-4 flex-wrap">
                            {Object.entries(APP_THEMES).map(([key, val]) => (
                                <button key={key} onClick={() => setAccentKey(key)} className={`w-10 h-10 rounded-full ${val.bg} transition-all ${accentKey === key ? 'scale-125 ring-4 ring-offset-4 ring-slate-300 dark:ring-zinc-700' : 'opacity-40 hover:opacity-100'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                        <span className="font-bold flex items-center gap-3 text-slate-900 dark:text-white"><Palette size={20} /> {t.darkMode}</span>
                        <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl cursor-pointer" onClick={() => setIsDarkMode(!isDarkMode)}>
                            <div className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${!isDarkMode ? 'bg-white shadow text-black' : 'opacity-50 text-slate-500'}`}>{t.light}</div>
                            <div className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${isDarkMode ? 'bg-zinc-800 shadow text-white' : 'opacity-50 text-slate-500'}`}>{t.dark}</div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="mb-8">
                <div className="text-xs font-bold uppercase opacity-60 mb-4 ml-1 tracking-widest text-slate-700 dark:text-white">{t.region}</div>
                <Card className="space-y-6">
                    <div><label className="text-xs font-bold opacity-60 mb-2 block text-slate-800 dark:text-slate-300">{t.lang}</label><CustomSelect value={lang} onChange={setLang} options={LANGUAGES} icon={Globe} /></div>
                    <div><label className="text-xs font-bold opacity-60 mb-2 block text-slate-800 dark:text-slate-300">{t.currency}</label><CustomSelect value={currency} onChange={setCurrency} options={currencyOptions} icon={Wallet} /></div>
                </Card>
            </div>
            <div className="mb-8">
                <div className="text-xs font-bold uppercase opacity-60 mb-4 ml-1 tracking-widest text-slate-700 dark:text-white">{t.account}</div>
                <Card className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xl">{user.avatar}</div>
                        <div><div className="font-bold text-slate-900 dark:text-white">{user.email}</div><div className="text-xs opacity-50 text-slate-600 dark:text-slate-400">{user.uid === "demo-user" ? "Local Demo" : "Synced Account"}</div></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={exportData} variant="secondary" icon={Download}>{t.export}</Button>
                        <label className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold bg-[#F2F3F5] hover:bg-slate-200 dark:bg-[#1E1F22] dark:hover:bg-[#3F4147] cursor-pointer transition-all text-sm text-slate-800 dark:text-white border border-transparent"><Upload size={18} /> {t.import} <input type="file" accept=".json" className="hidden" onChange={handleImport} /></label>
                    </div>
                    <Button onClick={() => setDeleteAccountModal(true)} variant="danger" icon={Trash2} className="w-full">{t.deleteAcc}</Button>
                    <Button onClick={handleLogout} variant="secondary" icon={LogOut} className="w-full">{t.logout}</Button>
                </Card>
            </div>
        </div>
    );
};