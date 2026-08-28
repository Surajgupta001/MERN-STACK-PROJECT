import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout'
import ProtectedRoutes from './components/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Sessions from './pages/Sessions'
import MeetingRoom from './pages/MeetingRoom'
import { Navigate } from 'react-router-dom'

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        {/* Private Routes */}
        <Route>
          <Route element={<ProtectedLayout />}>
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/sessions" element={<Sessions />} />
            </Route>
            <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
          </Route>
        </Route>
        {/* Other Routes */}
        <Route path="*" element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </>
  )
}
