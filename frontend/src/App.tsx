import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Schedule from './pages/Schedule'
import AttendancePoint from './pages/AttendancePoint'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes — requires auth session */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="schedule/:classId" element={<Schedule />} />
          <Route path="attendance-point" element={<AttendancePoint />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all: redirect unknown paths to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
