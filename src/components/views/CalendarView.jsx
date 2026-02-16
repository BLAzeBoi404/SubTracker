import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Title, Button } from '../ui/Elements';
import { getNextDate } from '../../utils/helpers';

export const CalendarView = ({ subs, t, theme, initialDate }) => {
    const [date, setDate] = useState(initialDate || new Date());
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); 
    const shift = firstDay === 0 ? 6 : firstDay - 1; 
    
    const days = Array(shift).fill(null).concat([...Array(daysInMonth).keys()].map(i => i + 1));
    const monthName = t.monthNames[month] || "Month";
  
    return (
      <div className="space-y-6 animate-fade-in pb-24 md:pb-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 bg-[#F2F3F5] dark:bg-[#121214] z-10 py-2">
            <Title>{t.calendar}</Title>
            <div className="flex items-center gap-3">
                <Button onClick={() => setDate(new Date())} variant="secondary" className="h-10 text-xs px-4 bg-white border border-slate-200 shadow-sm">{t.toToday}</Button>
                <div className="flex items-center gap-2 bg-white dark:bg-[#1E1E24] p-1.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <button onClick={() => setDate(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white"><ChevronLeft size={20} /></button>
                    <span className="font-bold text-lg min-w-[140px] text-center capitalize text-slate-900 dark:text-white">{monthName} {year}</span>
                    <button onClick={() => setDate(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white"><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
        
        <div className="hidden md:block overflow-x-auto">
            <Card className="min-h-[500px] !p-6 min-w-[700px]">
                <div className="grid grid-cols-7 gap-4">
                    {t.weekDays.map(d => <div key={d} className="text-center text-xs font-extrabold opacity-60 uppercase py-4 text-slate-700 dark:text-slate-400">{d}</div>)}
                    {days.map((day, i) => {
                        if(!day) return <div key={i} className="min-h-[100px]" />;
                        const dateStr = new Date(year, month, day).toDateString();
                        const isToday = dateStr === new Date().toDateString();
                        const daySubs = subs.filter(s => new Date(getNextDate(s.startDate, s.period)).toDateString() === dateStr);
                        
                        return (
                        <div key={i} className={`min-h-[100px] rounded-2xl p-3 border transition-all flex flex-col gap-2 group hover:border-emerald-500/30 ${isToday ? `${theme.border} bg-emerald-500/5` : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#25252A]'}`}>
                            <div className={`text-sm font-bold ${isToday ? theme.text : 'text-slate-800 dark:text-slate-300'}`}>{day}</div>
                            <div className="space-y-1 overflow-y-auto max-h-[60px] no-scrollbar">
                                {daySubs.map(s => <div key={s.id} className={`text-[10px] px-2 py-1 rounded-lg truncate font-bold text-white shadow-sm ${theme.bg}`}>{s.name}</div>)}
                            </div>
                        </div>
                        )
                    })}
                </div>
            </Card>
        </div>

        <div className="md:hidden flex flex-col gap-3">
            {days.filter(d => d !== null).map((day) => {
                const dateStr = new Date(year, month, day).toDateString();
                const isToday = dateStr === new Date().toDateString();
                const daySubs = subs.filter(s => new Date(getNextDate(s.startDate, s.period)).toDateString() === dateStr);
                const weekDayIndex = new Date(year, month, day).getDay();
                
                return (
                    <div key={day} className={`
                        flex gap-4 p-5 rounded-[1.5rem] border shadow-sm transition-all min-h-[80px]
                        ${isToday 
                            ? `bg-white dark:bg-[#1E1E24] border-emerald-500/50 ring-1 ring-emerald-500/20` 
                            : 'bg-white dark:bg-[#1E1E24] border-transparent'
                        }
                    `}>
                        <div className="flex flex-col items-center justify-center min-w-[50px] border-r border-slate-100 dark:border-white/5 pr-4">
                            <span className="text-xs font-bold uppercase opacity-50 text-slate-500">{t.weekDays[weekDayIndex]}</span>
                            <span className={`text-3xl font-black ${isToday ? theme.text : 'text-slate-900 dark:text-white'}`}>{day}</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-2">
                            {daySubs.length > 0 ? (
                                daySubs.map(s => (
                                    <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl ${s.color} text-white shadow-md`}>
                                        <span className="font-bold text-sm truncate">{s.name}</span>
                                        <span className="font-black text-xs bg-white/20 px-2 py-1 rounded-lg">{s.price}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm font-medium opacity-20 text-slate-500 italic pl-1">Нет событий</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    );
};