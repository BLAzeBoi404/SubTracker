import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Clock, Check } from 'lucide-react';
import { CURRENCIES, COLORS, CATEGORIES, SERVICES_DB, PLACEHOLDERS } from '../config/constants.js';
import { Button, Input, ConfirmModal } from './ui/Elements';
import CustomSelect from './ui/CustomSelect';
import CustomDatePicker from './ui/CustomDatePicker';

const SubscriptionModal = ({ isOpen, onClose, initialData, onSave, onDelete, t, theme, isDarkMode, region }) => {
  const [formData, setFormData] = useState(initialData);
  const [suggestions, setSuggestions] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [placeholderInput, setPlaceholderInput] = useState('Netflix...');
  
  const scrollRef = useRef(null);
  const colorScrollRef = useRef(null);

  useEffect(() => { 
    if (isOpen) { 
        setFormData(initialData); 
        setSuggestions([]); 
    } 
  }, [isOpen, initialData]);

  useEffect(() => {
    const category = formData.category || 'all';
    const options = PLACEHOLDERS[category] || PLACEHOLDERS.all;
    setPlaceholderInput((options[Math.floor(Math.random() * options.length)] || 'Netflix') + '...');
  }, [formData.category]);
  
  const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  if (!isOpen) return null;

  const handleNameInput = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, name: val }));
    if (val.length > 1) {
      const allServices = Array.from(new Set([...SERVICES_DB.GLOBAL, ...(SERVICES_DB[region] || [])]));
      setSuggestions(allServices.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0, 5));
    } else { setSuggestions([]); }
  };

  const handleSave = () => { 
      if (formData.name && formData.price) {
          onSave(formData); 
      } else {
          alert("Please enter name and price");
      }
  };
  
  const currencyOptions = CURRENCIES.map(c => ({ code: c.code, name: c.code }));

  return (
    <>
      <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-hidden">
        <div className={`w-full max-w-lg rounded-[2rem] shadow-2xl p-6 scale-100 animate-fade-in flex flex-col max-h-[90vh] ${isDarkMode ? 'bg-[#1E1E24]' : 'bg-white'}`}>
          
          <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{formData.id ? t.edit : t.add}</h2>
            <button onClick={onClose} className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="space-y-5 overflow-y-auto pr-2 -mr-2 no-scrollbar pb-10 md:pb-0">
            <div>
               <label className="text-xs font-bold uppercase mb-3 block opacity-50 tracking-wider text-slate-900 dark:text-white">{t.category}</label>
               <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 -mx-1 no-scrollbar mask-gradient-right">
                  {Object.entries(CATEGORIES).map(([key, cat]) => (key !== 'all' && (
                     <button 
                        type="button" 
                        key={key} 
                        onClick={() => setFormData({...formData, category: key})} 
                        className={`
                            px-5 py-3 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap active:scale-95 
                            ${formData.category === key 
                                ? `${formData.color || theme.bg} text-white border-transparent shadow-lg` 
                                : 'border-slate-200 dark:border-white/10 hover:border-current text-slate-600 dark:text-slate-400'
                            }
                        `}
                     >
                        <cat.icon size={18} /> {t.cats[cat.label] || cat.label}
                     </button>
                  )))}
               </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase mb-2 block opacity-50 tracking-wider text-slate-900 dark:text-white">{t.namePlace}</label>
              <div className="relative">
                <Input value={formData.name} onChange={handleNameInput} placeholder={placeholderInput} className="text-lg font-bold" required />
                {suggestions.length > 0 && (
                  <div className={`absolute z-10 w-full mt-2 rounded-2xl border shadow-xl max-h-40 overflow-y-auto ${isDarkMode ? 'bg-[#25252A] border-white/10' : 'bg-white border-slate-100'}`}>
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => { setFormData(prev => ({...prev, name: s})); setSuggestions([]); }} className="w-full text-left px-5 py-3 text-sm hover:bg-emerald-500 hover:text-white transition-colors font-medium text-slate-900 dark:text-white">{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase mb-2 block opacity-50 tracking-wider text-slate-900 dark:text-white">{t.cost}</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className={`w-full h-12 rounded-lg pl-4 pr-4 outline-none transition-all font-medium bg-[#F2F3F5] text-[#060607] placeholder:text-slate-400 dark:bg-[#2B2D31] dark:text-[#F2F3F5] dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50`} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-2 block opacity-50 tracking-wider text-slate-900 dark:text-white">{t.currency}</label>
                <CustomSelect value={formData.currency} onChange={val => setFormData({...formData, currency: val})} options={currencyOptions} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase mb-2 block opacity-50 tracking-wider text-slate-900 dark:text-white">{t.period}</label>
                <CustomSelect value={formData.period} onChange={val => setFormData({...formData, period: val})} options={[{code:'monthly',name:t.monthly}, {code:'yearly',name:t.yearly}]} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase mb-2 block opacity-50 tracking-wider text-slate-900 dark:text-white">{t.date}</label>
                <CustomDatePicker value={formData.startDate} onChange={val => setFormData({...formData, startDate: val})} t={t} />
              </div>
            </div>

            <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${formData.isTrial ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.isTrial ? 'bg-yellow-500 border-yellow-500' : 'border-slate-400'}`}>
                {formData.isTrial && <Check size={14} className="text-black" strokeWidth={3} />}
              </div>
              <input type="checkbox" checked={formData.isTrial || false} onChange={e => setFormData({...formData, isTrial: e.target.checked})} className="hidden" />
              <span className="font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white"><Clock size={18} className={formData.isTrial ? "text-yellow-500" : "opacity-50"} /> {t.trial}</span>
            </label>

            <div>
              <div ref={colorScrollRef} className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 -mx-1 no-scrollbar">
                {COLORS.map((c, i) => (
                  <button key={i} onClick={() => setFormData({...formData, color: c.val})} className={`w-12 h-12 rounded-full flex-shrink-0 ${c.val} flex items-center justify-center transition-transform active:scale-90 ${formData.color === c.val ? 'scale-110 ring-4 ring-offset-2 ring-slate-200 dark:ring-zinc-700' : 'opacity-70 hover:opacity-100'} ${isDarkMode ? 'ring-offset-zinc-900' : 'ring-offset-white'}`}></button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-dashed border-slate-200 dark:border-white/10 mt-2 shrink-0">
            {formData.id && (
              <Button onClick={() => setShowDeleteConfirm(true)} variant="danger" className="w-14 px-0"><Trash2 size={20} /></Button>
            )}
            <Button onClick={handleSave} className="flex-1 text-lg" theme={theme}>{t.save}</Button>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={() => onDelete(formData.id)} title="Delete Subscription?" message="This action cannot be undone." isDarkMode={isDarkMode} />
    </>
  );
};
export default SubscriptionModal;