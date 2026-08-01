import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { EmployeeDashboardPage } from './pages/EmployeeDashboardPage'
import { LoginPage } from './pages/LoginPage'
import { ManagerDashboardPage } from './pages/ManagerDashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="EMPLOYEE">
            <EmployeeDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRole="MANAGER">
            <ManagerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
