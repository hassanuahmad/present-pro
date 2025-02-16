import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Dashboard from './pages/dashboard';
import Practice from './pages/practice';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="practice" element={<Practice />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
