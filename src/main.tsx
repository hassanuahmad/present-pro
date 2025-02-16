import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Dashboard from './pages/dashboard';
import Practice from './pages/practice';
import Analyze from './pages/analyze';
import Challenges from './pages/challenges';
import AnalyzeDetail from './pages/analyze-detail';
import { ClerkProvider } from '@clerk/clerk-react'
import { ProtectedRoute } from './components/ProtectedRoute'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="practice"
            element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            }
          />
          <Route
            path="analyze"
            element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            }
          />
          <Route
            path="analyze/:id"
            element={
              <ProtectedRoute>
                <AnalyzeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="challenges"
            element={
              <ProtectedRoute>
                <Challenges />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
