/**
 * Entry point of the Yapple application.
 * Renders the root App component into the DOM.
 */

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
