import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import DeferredTracker from './components/DeferredTracker'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import './App.css'

import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'

// NOTE: no "isClient" gating and no head-tag cleanup here. The first client render must be
// identical to the prerendered DOM (the Toaster container is part of the prerendered HTML),
// and React 19 itself adopts the prerendered <title>/<meta>/<link> tags during hydration.
function App() {
  return (
    <HelmetProvider>
      <Toaster position="top-center" />
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
