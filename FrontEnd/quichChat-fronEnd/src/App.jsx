import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'

const App = () => {
  const {authUser} = useContext(AuthContext)
  return (<>
    <div className="relative h-screen flex items-center overflow-hidden justify-center sm:px-[15%] sm:py-[3%]">
  {/* Background image */}
  <img
    src="/bgImage.jpg"
    alt="background"
    className="absolute inset-0 w-full h-full object-cover -z-10"
    draggable="false"
  />
  <Toaster />
  <Routes>
    <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
    <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
    <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
  </Routes>
</div>
    </>
  )
}

export default App
