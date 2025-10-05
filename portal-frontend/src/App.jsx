
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import CommunitiesPage from './pages/CommunitiesPage'
import DonationPage from './pages/DonationPage'
import CommunityDetailPage from './pages/CommunityDetailPage'
import SinglePostPage from './pages/SinglePostPage'


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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/communities/:communityId" element={<CommunityDetailPage />} /> 
          <Route path="/posts/:postId" element={<SinglePostPage />} />
          <Route path="/donate" element={<DonationPage />} />
          {/* Add other main pages here later, e.g., <Route path="/profile" element={<ProfilePage />} /> */}
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
