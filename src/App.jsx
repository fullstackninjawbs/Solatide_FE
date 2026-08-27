import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop'
import DeferredTracker from './components/DeferredTracker'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import './App.css'

import { HelmetProvider } from 'react-helmet-async'

function App() {
  return (
    <HelmetProvider>
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



