import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AnalyticsLoader from './analytics'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <AnalyticsLoader />
  </StrictMode>,
)
