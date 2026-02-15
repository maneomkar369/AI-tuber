import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode removed — it double-invokes effects in development which
// destroys the WebGL/PIXI renderer mid-init and causes null-renderer crashes.
createRoot(document.getElementById('root')!).render(
  <App />,
)
