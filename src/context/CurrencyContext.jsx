import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const countriesList = [
  { name: 'Australia', code: 'AUD', countryCode: 'AU', symbol: '$', locale: 'en-AU' },
  { name: 'United States', code: 'USD', countryCode: 'US', symbol: '$', locale: 'en-US' },
  { name: 'United Kingdom', code: 'GBP', countryCode: 'GB', symbol: '£', locale: 'en-GB' },
  { name: 'Canada', code: 'CAD', countryCode: 'CA', symbol: '$', locale: 'en-CA' },
  { name: 'Euro Zone', code: 'EUR', countryCode: 'EU', symbol: '€', locale: 'en-IE' },
  { name: 'New Zealand', code: 'NZD', countryCode: 'NZ', symbol: '$', locale: 'en-NZ' },
  { name: 'India', code: 'INR', countryCode: 'IN', symbol: 'Rs. ', locale: 'en-IN' },
  { name: 'South Africa', code: 'ZAR', countryCode: 'ZA', symbol: 'R ', locale: 'en-ZA' },
  { name: 'Switzerland', code: 'CHF', countryCode: 'CH', symbol: 'CHF ', locale: 'de-CH' },
  { name: 'China', code: 'CNY', countryCode: 'CN', symbol: '¥', locale: 'zh-CN' },
  { name: 'Japan', code: 'JPY', countryCode: 'JP', symbol: '¥', locale: 'ja-JP' },
  { name: 'Denmark', code: 'DKK', countryCode: 'DK', symbol: 'kr. ', locale: 'da-DK' },
  { name: 'Singapore', code: 'SGD', countryCode: 'SG', symbol: 'S$', locale: 'en-SG' },
];

const fallbackRates = {
  INR: 1.0,
  AUD: 1 / 55.0,
  USD: 1 / 83.5,
  GBP: 1 / 106.0,
  CAD: 1 / 61.0,
  EUR: 1 / 90.0,
  NZD: 1 / 51.0,
  ZAR: 1 / 4.5,
  CHF: 1 / 93.0,
  CNY: 1 / 11.5,
  JPY: 1 / 0.52,
  DKK: 1 / 12.0,
  SGD: 1 / 61.5,
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return countriesList[0]; // Default to Australia (AUD)
  });

  const [rates, setRates] = useState(() => {
    const cached = localStorage.getItem('exchangeRates');
    const cachedTime = localStorage.getItem('exchangeRates_timestamp');
    if (cached && cachedTime) {
      // 24 hour cache duration
      if (Date.now() - parseInt(cachedTime, 10) < 24 * 60 * 60 * 1000) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Error parsing cached exchange rates', e);
        }
      }
    }
    return fallbackRates;
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/INR');
        const data = await response.json();
        if (data && data.result === 'success' && data.rates) {
          const newRates = { ...fallbackRates };
          Object.keys(fallbackRates).forEach((code) => {
            if (data.rates[code]) {
              newRates[code] = data.rates[code];
            }
          });
          setRates(newRates);
          localStorage.setItem('exchangeRates', JSON.stringify(newRates));
          localStorage.setItem('exchangeRates_timestamp', Date.now().toString());
        }
      } catch (err) {
        console.warn('Could not fetch latest rates from exchange rate API, using cache/fallbacks.', err);
      }
    };

    const cachedTime = localStorage.getItem('exchangeRates_timestamp');
    const shouldFetch = !cachedTime || (Date.now() - parseInt(cachedTime, 10) > 24 * 60 * 60 * 1000);
    if (shouldFetch) {
      fetchRates();
    }
  }, []);

  const changeCountry = (country) => {
    setSelectedCountry(country);
    localStorage.setItem('selectedCountry', JSON.stringify(country));
  };

  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '';

    let numericAmount = amount;
    if (typeof amount === 'string') {
      // Remove symbols, commas, and letters to extract number
      const stripped = amount.replace(/[^\d.]/g, '');
      const parsed = parseFloat(stripped);
      if (!isNaN(parsed)) {
        numericAmount = parsed;
      } else {
        return amount; // Fallback to raw string
      }
    }

    const rate = rates[selectedCountry.code] || fallbackRates[selectedCountry.code] || (1 / 83.5);
    const converted = numericAmount * rate;

    // Use standard Intl.NumberFormat for digit grouping and decimal formatting
    const numberFormatter = new Intl.NumberFormat(selectedCountry.locale || 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedVal = numberFormatter.format(converted);

    const symbol = selectedCountry.symbol || '$';
    const suffix = selectedCountry.code === 'INR' ? '' : ` ${selectedCountry.code}`;

    return `${symbol}${formattedVal}${suffix}`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedCountry, changeCountry, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

