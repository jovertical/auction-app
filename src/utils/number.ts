/**
 * Expects the value to be in cents and returns a formatted currency string.
 */
export const currencyFormat = (value: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(value / 100);
};
