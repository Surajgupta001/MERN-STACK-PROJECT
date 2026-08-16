import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import BuilderPage from './pages/BuilderPage'
import HomePage from './pages/HomePage'
import { AuthLayout, GuestLayout } from './pages/Layout'
import PreviewPage from './pages/PreviewPage'
import { Toaster } from 'react-hot-toast'
import PublishPage from './pages/PublishPage'

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Login Routes */}
        <Route element={<GuestLayout />}>
          <Route path='/login' element={<AuthPage mode="login" />} />
          <Route path='/register' element={<AuthPage mode="register" />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/builder/:id' element={<BuilderPage />} />
          <Route path='/preview/:id' element={<PreviewPage />} />
        </Route>

        {/* Public Routes */}
        <Route path='/publish/:id' element={<PublishPage />} />

        {/* Catch-all */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App