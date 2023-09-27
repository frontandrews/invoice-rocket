export const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');

/**
 * Format a number to a currency
 * @param {number} amount - The amount to be formatted
 * @param {string} currencyCode - The ISO code of the currency (e.g. 'USD', 'BRL', 'CAD')
 * @return {string} - The formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string): string {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
        }).format(amount);
    } catch (error) {
        console.error(`Failed to format the amount: ${amount} with currency code: ${currencyCode}`, error);
        return amount.toString();
    }
}

export function padWithZeros(number: number, length: number): string {
    let str = number.toString();

    return str.padStart(length, '0');
}

/**
 * Converts date from YYYY-MM-DD to DD-MM-YYYY
 * @param {string} date - Date in YYYY-MM-DD format
 * @return {string} - Date in DD-MM-YYYY format
 */
export const convertDateToDDMMYYYY = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
};

/**
 * Capitalizes the first letter of a given string.
 * @param {string} str - The string to be capitalized.
 * @returns {string} - The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isBrowser = (): boolean => typeof window !== 'undefined';