import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

if (rootElement && rootElement.hasChildNodes()) {
  try {
    hydrateRoot(rootElement, <App />, {
      onRecoverableError(error, errorInfo) {
        // Silently absorb recoverable hydration synchronizations so they don't trigger unhandled errors or clutter production logs
        if (
          error?.message?.includes('418') ||
          error?.message?.includes('423') ||
          error?.message?.includes('425') ||
          error?.message?.includes('Hydration') ||
          error?.message?.includes('hydrat')
        ) {
          return;
        }
        console.warn('Recoverable application notice:', error);
      }
    });
  } catch (err) {
    createRoot(rootElement).render(<App />);
  }
} else if (rootElement) {
  createRoot(rootElement).render(<App />);
}
