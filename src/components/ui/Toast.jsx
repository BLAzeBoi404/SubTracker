import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    error: 'bg-[#FF4B4B] text-white shadow-lg shadow-red-500/30',
    success: 'bg-[#00C853] text-white shadow-lg shadow-green-500/30',
    info: 'bg-[#2979FF] text-white shadow-lg shadow-blue-500/30'
  };

  const icons = {
    error: <AlertCircle size={24} />,
    success: <CheckCircle size={24} />,
    info: <Info size={24} />
  };

  return (
    <div className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[9999] 
        flex items-center gap-3 px-6 py-4 rounded-2xl 
        shadow-2xl transition-all animate-fade-in 
        w-[90%] max-w-[400px] md:w-auto
        ${styles[type] || styles.info}
    `}>
      <div className="shrink-0">{icons[type]}</div>
      <span className="font-bold text-sm leading-snug flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 opacity-70 hover:opacity-100 transition-opacity p-1">
        <X size={20} />
      </button>
    </div>
  );
};

export default Toast;