export const getDeclension = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export const convert = (price, currency, targetCurrency) => {
  const RATES = { 
    UAH: 1, USD: 41.5, EUR: 45.2, PLN: 10.4, KZT: 0.09, GBP: 52, 
    JPY: 0.27, CAD: 30, AUD: 27, CHF: 46, CNY: 5.7, TRY: 1.2 
  };
  
  if (!price || isNaN(price)) return 0;
  if (currency === targetCurrency) return price;
  
  return (price * (RATES[currency] || 1)) / (RATES[targetCurrency] || 1);
};

export const getNextDate = (startStr, period) => {
  const start = new Date(startStr);
  const now = new Date(); 
  now.setHours(0,0,0,0);
  
  let next = new Date(start);
  if (isNaN(next.getTime())) return new Date();
  
  while (next < now) {
    period === 'monthly' 
      ? next.setMonth(next.getMonth() + 1) 
      : next.setFullYear(next.getFullYear() + 1);
  }
  return next;
};

export const getDaysLeft = (date) => {
  return Math.ceil((date - new Date().setHours(0,0,0,0)) / 86400000);
};