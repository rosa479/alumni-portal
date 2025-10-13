import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import DonationPage from "./pages/DonationPage";
import CommunityDetailPage from "./pages/CommunityDetailPage";
import SinglePostPage from "./pages/SinglePostPage";
import EndowmentPage from "./pages/EndowmentPage";
import ContributionDetailPage from "./pages/ContributionDetailPage";
import LandingPage from "./pages/LandingPage";
import MobileBottomNav from "./components/MobileBottomNav";
import OAuthCallback from "./pages/OAuthCallback";

function MainLayout() {
  return (
    <div className="relative min-h-screen font-sans">
      <Header />
      
      {/* 👇 UPDATE THE PADDING HERE */}
      {/* Increase bottom padding to give the floating nav space */}
      <main className="pb-28 md:pb-0"> 
        <Outlet /> 
      </main>

      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes WITHOUT the main header */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/callback" element={<OAuthCallback />} />

        {/* Routes WITH the main header */}
        <Route element={<MainLayout />}>
          {/* Public-ish routes with header (if any) could go here */}

          {/* This is the new, correct way to protect routes */}
          <Route element={<ProtectedRoute />}>
            {/* All routes nested inside here are now protected */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users/:userId" element={<UserProfilePage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route
              path="/communities/:communityId"
              element={<CommunityDetailPage />}
            />
            <Route path="/posts/:postId" element={<SinglePostPage />} />
            <Route path="/donate" element={<DonationPage />} />
            <Route path="/endowment" element={<EndowmentPage />} />
            <Route
              path="/endowment/:contributionId"
              element={<ContributionDetailPage />}
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
