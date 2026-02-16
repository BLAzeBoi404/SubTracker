import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => (opt.code || opt.value || opt) === value);
  const displayValue = selectedOption?.name || selectedOption?.label || selectedOption?.code || value;
  const displayFlag = selectedOption?.flag || '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-12 rounded-lg px-4 flex items-center justify-between
          bg-[#F2F3F5] text-[#060607]
          dark:bg-[#2B2D31] dark:text-[#F2F3F5]
          font-bold text-sm transition-all duration-200
          outline-none focus:ring-2 focus:ring-emerald-500/50
        `}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} className="text-slate-500" />}
          <span className="flex items-center gap-2 truncate">
            {displayFlag && <span className="text-lg">{displayFlag}</span>}
            {displayValue}
          </span>
        </div>
        <ChevronDown size={18} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 p-1.5 rounded-xl bg-white border border-slate-200 shadow-xl dark:bg-[#2B2D31] dark:border-[#1E1F22] max-h-60 overflow-y-auto no-scrollbar animate-fade-in">
          {options.map((opt, i) => {
            const val = opt.code || opt.value || opt;
            const label = opt.name || opt.label || val;
            const flag = opt.flag;
            const isSelected = val === value;

            return (
              <button
                key={i}
                type="button"
                onClick={() => { onChange(val); setIsOpen(false); }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold transition-colors
                  ${isSelected 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-slate-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-[#3F4147]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {flag && <span className="text-lg">{flag}</span>}
                  <span>{label}</span>
                </div>
                {isSelected && <Check size={16} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;