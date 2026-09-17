import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
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
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="schedule/:classId" element={<Schedule />} />
        <Route path="attendance-point" element={<AttendancePoint />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
