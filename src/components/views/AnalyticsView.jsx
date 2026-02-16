import React from 'react';
import { Card, Title } from '../ui/Elements';
import { CATEGORIES } from '../../config/constants';

export const AnalyticsView = ({ totalMonthly, currencySign, t, theme, categoryStats }) => {
    return (
      <div className="animate-fade-in space-y-6 pb-24 md:pb-0">
        <Title>{t.analytics}</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="text-xs font-bold uppercase opacity-60 mb-6 text-slate-600 dark:text-slate-400">{t.catStats}</div>
            <div className="space-y-6">
              {categoryStats.map((stat) => {
                  return (
                    <div key={stat.key}>
                      <div className="flex justify-between text-sm font-bold mb-2 text-slate-900 dark:text-white">
                        <span className="capitalize flex items-center gap-2">
                           {CATEGORIES[stat.key]?.icon && React.createElement(CATEGORIES[stat.key].icon, {size:16})}
                           {t.cats[stat.key] || stat.key}
                        </span>
                        <span>{Math.round(stat.val)} {currencySign} ({Math.round(stat.percent)}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${theme.bg} rounded-full transition-all duration-1000 ease-out`} style={{width: `${stat.percent}%`}} />
                      </div>
                    </div>
                  );
              })}
              {categoryStats.length === 0 && <div className="text-center opacity-50 py-10">{t.empty}</div>}
            </div>
          </Card>
        </div>
      </div>
    );
};