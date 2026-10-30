import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

// Report (never suppress) hydration/recoverable errors. One telemetry event per page load.
let hydrationErrorReported = false
const onRecoverableError = (error, errorInfo) => {
  const route = window.location.pathname
  const message = error?.message || String(error)
  console.error(`[hydration] recoverable error on ${route}: ${message}`, errorInfo?.componentStack || '')
  if (hydrationErrorReported) return
  hydrationErrorReported = true
  try {
    // Non-PII: route only. The first-party analytics API only accepts commerce events, so the
    // signal goes to GTM's dataLayer (configure a GA4 event "hydration_error" there).
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'hydration_error', page_path: route })
  } catch {
    // telemetry must never break the page
  }
}

const normalizePath = (p) => (p && p.length > 1 ? p.replace(/\/+$/, '') : p || '/')

if (rootElement) {
  // Prerendered routes ship markup inside #root (tagged with the path it was rendered for) →
  // hydrate it. SPA shells (200.html, checkout.html) have an empty #root, and markup rendered for
  // a different path (e.g. 404.html served for /products/unknown) cannot match the client tree →
  // plain client render, which replaces the static markup.
  const prerenderedPath = rootElement.getAttribute('data-prerendered-path')
  const canHydrate = !!rootElement.firstElementChild &&
    normalizePath(prerenderedPath) === normalizePath(window.location.pathname)
  if (canHydrate) {
    hydrateRoot(rootElement, <App />, { onRecoverableError })
  } else {
    if (rootElement.firstElementChild) {
      // Replacing markup that was prerendered for another path (e.g. 404.html): React only adopts
      // existing head tags while hydrating, so drop the static SEO tags it is about to render
      // itself — otherwise title/robots/canonical would be duplicated.
      document.head
        .querySelectorAll('title, meta[name="description"], meta[name="robots"], link[rel="canonical"], meta[property^="og:"], meta[name^="twitter:"]')
        .forEach((el) => el.remove())
    }
    createRoot(rootElement, { onRecoverableError }).render(<App />)
  }
}
