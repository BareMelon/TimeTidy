import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Schedule from './pages/Schedule'
import CheckIn from './pages/CheckIn'
import Admin from './pages/Admin'
import PasswordResetModal from './components/PasswordResetModal'
import { ToastContainer, useToast } from './components/Toast'

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function AppWithToasts() {
  const { isAuthenticated, user } = useAuthStore()
  const { toasts, removeToast } = useToast()

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? <Login /> : <Navigate to="/" replace />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute>
              <Layout>
                <Schedule />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/checkin" element={
            <ProtectedRoute>
              <Layout>
                <CheckIn />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout>
                <Admin />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>

        {/* Password Reset Modal for temporary users */}
        {isAuthenticated && user?.mustResetPassword && (
          <PasswordResetModal isOpen={true} />
        )}

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </Router>
    </QueryClientProvider>
  )
}

function App() {
  return <AppWithToasts />
}

export default App 