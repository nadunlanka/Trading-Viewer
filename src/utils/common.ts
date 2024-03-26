export const formatNumber = (number: number) => {
  return Number(number.toFixed(2)).toLocaleString('en', {
    minimumFractionDigits: 2
  });
};

export const formatCurrency = (currency: string, price: number) => {
  return new Intl.NumberFormat('en-us', {
    style: 'currency',
    currency: currency
  }).format(price);
};
