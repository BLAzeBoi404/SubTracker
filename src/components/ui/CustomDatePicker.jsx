import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CustomDatePicker = ({ value, onChange, className = "", t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches);
  const containerRef = useRef(null);
  const calendarRef = useRef(null);

  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
      if (isOpen && !mobile) updatePosition();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const updatePosition = () => {
    if (containerRef.current && !isMobile) {
      const inputRect = containerRef.current.getBoundingClientRect();
      const screenW = window.innerWidth;
      
      const calWidth = 320;
      const calHeight = 360;
      const gap = 8;

      let top = inputRect.top - calHeight - gap;
      
      if (top < 0) {
        top = inputRect.bottom + gap;
      }

      let left = inputRect.right - calWidth;

      if (left < 10) {
        left = inputRect.left;
      }

      if (left + calWidth > screenW) {
        left = screenW - calWidth - 10;
      }

      setCoords({ left, top });
    }
  };

  useEffect(() => {
    if (isOpen && !isMobile) {
        requestAnimationFrame(updatePosition);
        window.addEventListener('scroll', updatePosition, true);
    }
    return () => window.removeEventListener('scroll', updatePosition, true);
  }, [isOpen, isMobile]);

  const handleDayClick = (day) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const offsetDate = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000));
    onChange(offsetDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToToday = () => setViewDate(new Date());

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay(); 
  const shift = firstDay === 0 ? 6 : firstDay - 1; 
  const days = Array(shift).fill(null).concat([...Array(daysInMonth).keys()].map(i => i + 1));

  const months = t?.monthNames || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = t?.weekDaysShort || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const calendarContent = (
    <div 
        ref={calendarRef}
        className={`
            bg-white dark:bg-[#1E1E24] border border-slate-200 dark:border-white/10 shadow-2xl font-sans animate-fade-in
            ${isMobile 
                ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] rounded-2xl p-5 z-[9999]' 
                : 'fixed w-[320px] rounded-xl p-4 z-[9999]'
            }
        `}
        style={!isMobile ? { top: coords.top, left: coords.left } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-700 dark:text-white transition-colors"><ChevronLeft size={20}/></button>
        <span className="font-bold text-base text-slate-900 dark:text-white capitalize">{months[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
        <button type="button" onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-700 dark:text-white transition-colors"><ChevronRight size={20}/></button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(d => <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase py-1">{d}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const currentStr = new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
          const selectedStr = value ? new Date(value).toDateString() : '';
          const isSelected = currentStr === selectedStr;
          const isToday = currentStr === new Date().toDateString();

          return (
            <button 
              key={i} type="button" onClick={() => handleDayClick(day)}
              className={`
                h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                ${isSelected 
                  ? 'bg-emerald-500 text-white shadow-md' 
                  : isToday 
                    ? 'text-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center px-1">
         <button type="button" onClick={goToToday} className="text-xs font-bold text-emerald-500 hover:underline">{t?.toToday || 'Today'}</button>
         {isMobile && <button type="button" onClick={() => setIsOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">{t?.cancel || 'Close'}</button>}
      </div>
    </div>
  );

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(true)} 
        className={`
            w-full h-12 rounded-lg pl-12 pr-5 flex items-center cursor-pointer 
            bg-[#F2F3F5] text-[#060607] dark:bg-[#2B2D31] dark:text-white 
            font-bold border border-transparent focus-within:ring-2 focus-within:ring-emerald-500/50 
            transition-all select-none
        `}
      >
        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" size={18} />
        {value ? new Date(value).toLocaleDateString() : (t?.selectDate || 'Select Date')}
      </div>
      
      {isOpen && ReactDOM.createPortal(
        <>
          <div className="fixed inset-0 bg-black/10 z-[9998]" onClick={() => setIsOpen(false)} />
          {isMobile && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" onClick={() => setIsOpen(false)} />}
          {calendarContent}
        </>,
        document.body
      )}
    </div>
  );
};

export default CustomDatePicker;