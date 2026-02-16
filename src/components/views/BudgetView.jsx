import React from 'react';
import { Card, Title, StatBox } from '../ui/Elements';

export const BudgetView = ({ budget, setBudget, totalMonthly, currencySign, t, theme }) => {
    const budgetNum = parseFloat(budget) || 0;
    
    let monthsLeft = 0;
    let runwayText = "0 " + t.months;
    if (budgetNum > 0) {
        if (totalMonthly === 0) {
            runwayText = t.forever || "∞";
        } else {
            monthsLeft = budgetNum / totalMonthly;
            if (monthsLeft < 1) {
                const days = Math.round(monthsLeft * 30);
                runwayText = `${days} ${t.daysLeft}`;
            } else {
                runwayText = `${monthsLeft.toFixed(1)} ${t.months}`;
            }
        }
    }

    const percent = budgetNum > 0 ? (totalMonthly / budgetNum) * 100 : 0;
    const remaining = budgetNum - totalMonthly;

    return (
      <div className="animate-fade-in max-w-2xl mr-auto space-y-8 pb-24 md:pb-0">
          <Title>{t.budgetTitle}</Title>
          <Card className="!p-8">
              <div className="text-xs font-bold uppercase opacity-60 mb-3 tracking-widest text-slate-700 dark:text-slate-400">{t.budgetInput}</div>
              <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold opacity-30 text-slate-900 dark:text-white">{currencySign}</span>
                  <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className="w-full bg-transparent text-5xl font-black outline-none placeholder:opacity-10 text-slate-900 dark:text-white" placeholder="0" />
              </div>
          </Card>
          {budgetNum > 0 && (
            <>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white"><span>{Math.round(percent)}% {t.spent}</span><span className={remaining < 0 ? 'text-red-500' : ''}>{remaining.toFixed(0)} {currencySign} {remaining < 0 ? t.overBudget : t.remaining}</span></div>
                    <div className="h-4 bg-slate-200 dark:bg-[#1E1F22] rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${remaining < 0 ? 'bg-red-500' : theme.bg}`} style={{width: `${Math.min(percent, 100)}%`}} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Card><StatBox label={t.spent} value={totalMonthly.toFixed(0)} subtext={t.months} /></Card>
                    <Card className="relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-10 opacity-10 rounded-full blur-xl -mr-5 -mt-5 ${theme.bg}`}></div>
                        <StatBox label={t.runway || "Runway"} value={runwayText} color={monthsLeft < 1 && totalMonthly > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'} />
                    </Card>
                </div>
            </>
          )}
      </div>
    )
};