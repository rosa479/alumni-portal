import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import DonationPage from "./pages/DonationPage";
import CommunityDetailPage from "./pages/CommunityDetailPage";
import SinglePostPage from "./pages/SinglePostPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import ScholarshipDetailPage from "./pages/ScholarshipDetailPage";

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
    <Router>
      <Routes>
        {/* Routes WITHOUT the main header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes WITH the main header */}
        <Route element={<MainLayout />}>
          {/* Public-ish routes with header (if any) could go here */}

          {/* This is the new, correct way to protect routes */}
          <Route element={<ProtectedRoute />}>
            {/* All routes nested inside here are now protected */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route
              path="/communities/:communityId"
              element={<CommunityDetailPage />}
            />
            <Route path="/posts/:postId" element={<SinglePostPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/scholarships" element={<ScholarshipsPage />} />
            <Route
              path="/scholarships/:scholarshipId"
              element={<ScholarshipDetailPage />}
            />

            {/* Fallback route for authenticated users */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
