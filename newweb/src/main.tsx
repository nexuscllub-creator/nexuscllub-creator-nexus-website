import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import './styles.css'

const hostname = window.location.hostname

const isLocal =
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname.startsWith('192.168.')

if (isLocal) {
  const root = document.getElementById('root')!
  root.style.cssText =
    'display:flex;align-items:center;justify-content:center;height:100vh;' +
    'font-family:system-ui,sans-serif;background:#0a0a0a;color:#e5e5e5;text-align:center;'
  root.innerHTML = `
    <div style="max-width:480px;padding:2rem;">
      <div style="font-size:2.5rem;margin-bottom:1rem;">🚫</div>
      <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.75rem;color:#f5f5f5;">
        Local access is disabled
      </h1>
      <p style="color:#a3a3a3;line-height:1.6;margin-bottom:1.5rem;">
        This app only runs on Railway production.
        Local development is not supported.
      </p>
    </div>
  `
} else {
  const router = getRouter()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
}
