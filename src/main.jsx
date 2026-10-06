import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root')

if (rootElement && rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />)
} else if (rootElement) {
  createRoot(rootElement).render(<App />)
}
