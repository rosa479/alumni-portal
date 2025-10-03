
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'


function MainLayout() {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <Outlet />
    </div>
  );
}

function App() {

  return (
    <>
      <Router>
      <Routes>
        {/* Routes for pages without the main header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Routes for pages WITH the main header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other main pages here later, e.g., <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
