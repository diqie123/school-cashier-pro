
/**
 * Formats a number as Indonesian Rupiah (IDR).
 * @param {number} amount - The number to format.
 * @returns {string} The formatted currency string.
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a date string or Date object into a more readable format.
 * @param {string | Date} date - The date to format.
 * @param {object} options - Intl.DateTimeFormat options.
 * @returns {string} The formatted date string.
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  return new Date(date).toLocaleDateString('id-ID', options);
};

/**
 * Formats a date string or Date object to include time.
 * @param {string | Date} date - The date to format.
 * @returns {string} The formatted date and time string.
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
