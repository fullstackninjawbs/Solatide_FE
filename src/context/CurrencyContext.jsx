import React, { createContext, useContext, useState, useEffect } from 'react';
import { Country } from 'country-state-city';

const CurrencyContext = createContext();

const getSymbol = (currencyCode, locale) => {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol'
    }).formatToParts(1);
    const symbolPart = parts.find(p => p.type === 'currency');
    return symbolPart ? symbolPart.value : currencyCode;
  } catch(e) {
    return currencyCode;
  }
}

export const countriesList = Country.getAllCountries()
  .filter(c => c.currency)
  .map(c => ({
    name: c.name,
    code: c.currency,
    countryCode: c.isoCode,
    symbol: getSymbol(c.currency, `en-${c.isoCode}`),
    locale: `en-${c.isoCode}`,
  }));

const fallbackRates = {
  AUD: 1.0,
  USD: 0.65,
  GBP: 0.52,
  EUR: 0.60,
  CAD: 0.90,
  NZD: 1.08,
  INR: 54.0,
  ZAR: 12.0,
  CHF: 0.58,
  CNY: 4.7,
  JPY: 98.0,
  DKK: 4.5,
  SGD: 0.88,
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
    return countriesList.find(c => c.countryCode === 'AU') || countriesList[0]; // Default to Australia (AUD)
  });

  const [rates, setRates] = useState(() => {
    const cached = localStorage.getItem('exchangeRates_AUD');
    const cachedTime = localStorage.getItem('exchangeRates_timestamp_AUD');
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
        const response = await fetch('https://open.er-api.com/v6/latest/AUD');
        const data = await response.json();
        if (data && data.result === 'success' && data.rates) {
          const newRates = { ...fallbackRates };
          Object.keys(fallbackRates).forEach((code) => {
            if (data.rates[code]) {
              newRates[code] = data.rates[code];
            }
          });
          setRates(newRates);
          localStorage.setItem('exchangeRates_AUD', JSON.stringify(newRates));
          localStorage.setItem('exchangeRates_timestamp_AUD', Date.now().toString());
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

    const rate = rates[selectedCountry.code] || fallbackRates[selectedCountry.code] || 1.0;
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

  // Admin helper: always formats from INR base to AUD regardless of selected currency
  const formatAUD = (amount) => {
    if (amount === undefined || amount === null) return '—';
    let numericAmount = amount;
    if (typeof amount === 'string') {
      const stripped = amount.replace(/[^\d.]/g, '');
      const parsed = parseFloat(stripped);
      if (!isNaN(parsed)) {
        numericAmount = parsed;
      } else {
        return amount;
      }
    }
    const audRate = rates['AUD'] || fallbackRates['AUD'];
    const converted = numericAmount * audRate;
    return `$${new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted)} AUD`;
  };

  return (
    <CurrencyContext.Provider value={{ selectedCountry, changeCountry, formatPrice, formatAUD }}>
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

