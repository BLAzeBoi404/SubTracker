import React from 'react';
import { Search, Plus, Calendar as CalIcon } from 'lucide-react';
import { Card, StatBox, Input } from '../ui/Elements';
import { CATEGORIES } from '../../config/constants';
import { getNextDate, getDeclension, getDaysLeft, convert } from '../../utils/helpers';

export const DashboardView = ({ subs, totalMonthly, currencySign, t, theme, onEdit, searchTerm, setSearchTerm, filterCat, setFilterCat, jumpToCalendar, categoryStats, currency }) => {
  const filteredSubs = subs.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterCat === 'all' || s.category === filterCat)
  );

  const itemsText = getDeclension(subs.length, t.subsPlural || ['item', 'items', 'items']);

  const isLightAccent = ['Lemon', 'Lime', 'Yellow', 'Cyan', 'Teal'].includes(theme.name) || 
                        theme.bg.includes('yellow') || 
                        theme.bg.includes('lime') ||
                        theme.bg.includes('cyan') ||
                        theme.bg.includes('teal') ||
                        theme.bg.includes('white');

  const cardTextColor = isLightAccent ? 'text-slate-900' : 'text-white';
  const badgeBg = isLightAccent ? 'bg-black/10' : 'bg-white/20';

  return (
    <div className="animate-fade-in space-y-8 pb-24 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        <Card className={`bg-gradient-to-br ${theme.bg} to-black/10 !border-0 relative overflow-hidden h-48 flex flex-col justify-center shadow-lg`}>
          <div className="absolute top-0 right-0 p-24 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <StatBox label={t.totalMonth} value={`${Math.round(totalMonthly).toLocaleString()} ${currencySign}`} color={cardTextColor} />
          <div className={`mt-4 inline-flex px-3 py-1 rounded-full ${badgeBg} text-xs font-bold w-max backdrop-blur-sm border border-white/10 ${cardTextColor}`}>
            {subs.length} {itemsText}
          </div>
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-4"><h3 className="font-bold opacity-60 text-sm uppercase text-slate-600 dark:text-slate-400">{t.catStats}</h3></div>
          <div className="space-y-3 max-h-[120px] overflow-y-auto custom-scrollbar-x">
            {categoryStats.slice(0, 4).map((stat) => (
              <div key={stat.key} className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-300">
                <span className="capitalize flex items-center gap-2">
                    {CATEGORIES[stat.key]?.icon && React.createElement(CATEGORIES[stat.key].icon, {size:14})} 
                    {t.cats[stat.key] || stat.key}
                </span>
                <span className="opacity-80">{Math.round(stat.val)} {currencySign}</span>
              </div>
            ))}
            {categoryStats.length === 0 && <div className="text-sm opacity-50 text-slate-600">{t.empty}</div>}
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 sticky top-0 z-20 py-2">
        <div className="w-full md:w-80 shadow-sm">
            <Input icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t.search} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar-x mask-gradient-right">
          {Object.entries(CATEGORIES).map(([key, cat]) => ((key === 'all' || subs.some(s => s.category === key)) && 
            <button key={key} onClick={() => setFilterCat(key)} className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border whitespace-nowrap ${filterCat === key ? `${theme.bg} text-white border-transparent shadow-md` : 'bg-white dark:bg-[#1E1E24] border-slate-200 dark:border-white/5 hover:border-current text-slate-700 dark:text-slate-300'}`}>
              {t.cats[cat.label] || cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <button onClick={() => onEdit(null)} className="min-h-[180px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-emerald-500 group">
            <div className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 group-hover:bg-current group-hover:text-white flex items-center justify-center transition-colors ${theme.text}`}><Plus size={24} /></div>
            <span className={`font-bold group-hover:text-current ${theme.text}`}>{t.add}</span>
        </button>
        
        {filteredSubs.map(sub => {
          const days = getDaysLeft(getNextDate(sub.startDate, sub.period));
          const CatIcon = CATEGORIES[sub.category]?.icon || Plus;
          const displayPrice = convert(sub.price, sub.currency, currency);

          return (
            <Card key={sub.id} onClick={() => onEdit(sub)} className="flex flex-col justify-between h-[180px] relative overflow-hidden group">
              {sub.isTrial && <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">{t.trialLabel}</div>}
              
              <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-md`}>
                    <CatIcon size={24} />
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${days <= 3 ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}>
                    {days} {t.daysLeft}
                  </div>
              </div>
              
              <div>
                  <h3 className="font-bold text-lg mb-1 truncate text-slate-900 dark:text-white">{sub.name}</h3>
                  <div className="flex justify-between items-end">
                      <span className="text-xs font-bold uppercase opacity-60 text-slate-600 dark:text-slate-400">{sub.period === 'monthly' ? t.monthly : t.yearly}</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {Math.round(displayPrice)} <span className="text-sm opacity-50">{currencySign}</span>
                      </span>
                  </div>
              </div>
              
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => jumpToCalendar(e, sub)} className="bg-white dark:bg-[#25252A] p-2 rounded-lg shadow-md hover:scale-110 transition-transform text-slate-700 dark:text-white" title={t.showInCalendar}>
                    <CalIcon size={16} />
                </button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  );
};