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
import AdminScholarship from "./pages/AdminScholarship";
import AdminPanel from "./components/AdminPanel";
import Applications from "./components/Applications";
import ApplicationDetails from "./components/ApplicationDetails";
import PendingApprovals from "./components/PendingApprovals";
import AllScholarships from "./components/AllScholarships";
import NewScholarship from "./components/NewScholarship";

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
        {/* Admin area (uses AdminScholarship as a layout for nested admin routes) */}
        <Route path="/admin" element={<AdminScholarship />}> 
          <Route index element={<AdminPanel />} />
          <Route path="applications" element={<Applications />} />
          <Route path="application/:id" element={<ApplicationDetails />} />
          <Route path="pending" element={<PendingApprovals/>} />
          <Route path="scholarships" element={<AllScholarships/>} />
          <Route path="scholarships/new" element={<NewScholarship/>} />
        </Route>

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
