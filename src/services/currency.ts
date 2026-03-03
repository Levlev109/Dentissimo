// Currency conversion service based on Wise rates
// Base prices are in UAH (Ukrainian Hryvnia)

// Exchange rates (UAH to target currency) - based on Wise rates
const exchangeRates: Record<string, number> = {
  uk: 1,        // UAH - base currency
  en: 41,       // EUR: 1 EUR ≈ 41 UAH
  de: 41,       // EUR: 1 EUR ≈ 41 UAH
  fr: 41,       // EUR: 1 EUR ≈ 41 UAH
  es: 41,       // EUR: 1 EUR ≈ 41 UAH
  it: 41,       // EUR: 1 EUR ≈ 41 UAH
  pl: 9.5,      // PLN: 1 PLN ≈ 9.5 UAH
};

/**
 * Convert price from UAH to the currency of the selected language
 * @param priceInUAH - Price in Ukrainian Hryvnia
 * @param language - Current language code
 * @returns Converted price
 */
export function convertPrice(priceInUAH: number, language: string): number {
  const rate = exchangeRates[language] || exchangeRates['en'];
  
  if (language === 'uk') {
    return priceInUAH; // No conversion needed for UAH
  }
  
  // Convert from UAH to target currency
  const converted = priceInUAH / rate;
  
  // Round to 2 decimal places
  return Math.round(converted * 100) / 100;
}

/**
 * Format price with proper decimals based on currency
 * @param price - Price to format
 * @param language - Current language code
 * @returns Formatted price string
 */
export function formatPrice(price: number, language: string): string {
  if (language === 'uk') {
    // UAH - show without decimals if whole number
    return price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  }
  
  // EUR and PLN - always show 2 decimals
  return price.toFixed(2);
}
