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

export const removeDuplicates = (array: any, key: any) => {
  return array.filter((obj: any, index: any) => {
    return (
      index ===
      array.findIndex((o: any) => {
        return o[key] === obj[key];
      })
    );
  });
};
