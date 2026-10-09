import React, { useLayoutEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import DeferredTracker from './components/DeferredTracker'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import './App.css'

import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

// Removes pre-rendered SSR/prerender tags upon client hydration so React Helmet maintains 100% single tag ownership
const HelmetHydrationCleaner = () => {
  useLayoutEffect(() => {
    const preRenderedTags = document.head.querySelectorAll('[data-rh="true"]');
    preRenderedTags.forEach(el => el.remove());
  }, []);
  return null;
};

function App() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <HelmetProvider>
      <HelmetHydrationCleaner />
      {isClient && <Toaster position="top-center" />}
      <CartProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <DeferredTracker />
            <ScrollToTop />
            <AppRoutes />
          </BrowserRouter>
        </CurrencyProvider>
      </CartProvider>
    </HelmetProvider>
  )
}

export default App



