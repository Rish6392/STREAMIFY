import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "stream-chat-react/dist/css/v2/index.css";

import './index.css'
import App from './App.jsx'
import { enableMockApi } from './lib/mockApi.js'

import { BrowserRouter } from 'react-router-dom'

import {

  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// Create a client
const queryClient = new QueryClient()

// If no API URL configured in production, enable the mock API so the app works without a backend
if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL) {
  try {
    enableMockApi();
    // eslint-disable-next-line no-console
    console.info('Mock API enabled (no VITE_API_URL set).');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to enable Mock API:', e);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>

    </BrowserRouter>

  </StrictMode>,
)
