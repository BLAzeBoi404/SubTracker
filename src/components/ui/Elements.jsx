import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`
      rounded-2xl p-6 transition-all duration-200
      bg-white border border-slate-200 shadow-sm text-slate-900
      dark:bg-[#1E1E24] dark:border-white/5 dark:shadow-none dark:text-white
      ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''} 
      ${className}
    `}
  >
    {children}
  </div>
);

export const Title = ({ children }) => (
  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-8 px-1">
    {children}
  </h2>
);

export const Button = ({ children, onClick, variant = 'primary', className = "", icon: Icon, theme, type = "button", disabled }) => {
  const base = "flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 text-sm disabled:opacity-50 disabled:pointer-events-none select-none";
  
  const styles = {
    primary: `${theme?.bg || 'bg-emerald-500'} hover:opacity-90 text-white shadow-lg shadow-black/10`,
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    ghost: "bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {Icon && <Icon size={20} strokeWidth={2.5} />}
      {children}
    </button>
  );
};

export const Input = ({ value, onChange, placeholder, type = "text", icon: Icon, className = "", required }) => (
  <div className={`relative group ${className}`}>
    {Icon && (
      <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors pointer-events-none" size={20} />
    )}
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      required={required}
      className={`
        w-full h-14 rounded-2xl
        bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-500
        dark:bg-black/20 dark:border-white/10 dark:text-white dark:placeholder:text-slate-500
        ${Icon ? 'pl-14' : 'pl-5'} pr-5
        outline-none 
        focus:border-current focus:ring-1 focus:ring-current
        transition-all font-semibold
      `} 
    />
  </div>
);

export const StatBox = ({ label, value, subtext, color }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-600 dark:text-slate-400 mb-1">{label}</span>
    <span className={`text-3xl md:text-4xl font-black tracking-tight ${color ? color : 'text-slate-900 dark:text-white'}`}>{value}</span>
    {subtext && <span className="text-xs font-bold text-slate-500 mt-1">{subtext}</span>}
  </div>
);

export const ErrorAlert = ({ message }) => (
  <div className="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
    <AlertTriangle size={20} strokeWidth={2.5} />
    <span className="font-bold text-sm">{message}</span>
  </div>
);

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDarkMode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl scale-100 animate-fade-in ${isDarkMode ? 'bg-[#1E1E24]' : 'bg-white'}`}>
        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="secondary" className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} variant="danger" className="flex-1">Delete</Button>
        </div>
      </div>
    </div>
  );
};