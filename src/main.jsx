import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './stellar-minds'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)