// src/components/MobileBottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, User, Heart, Award } from 'react-feather';

const navLinks = [
  { to: '/dashboard', icon: Home},
  { to: '/communities', icon: Users},
  { to: '/profile', icon: User},
  { to: '/donate', icon: Heart},
  { to: '/endowment', icon: Award},
];

function MobileBottomNav() {
  const getLinkClassName = ({ isActive }) => {
    const baseClasses = "flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-300";
    return isActive 
      ? `${baseClasses} text-[#0077B5]` // Active link color
      : `${baseClasses} text-gray-500 hover:text-[#0077B5]`; // Inactive link color
  };

  return (
    // Main container for the floating bar
    <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white/70 backdrop-blur-lg border border-gray-200/80 rounded-full shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map(({ to, icon: Icon, label }, index) => {
          

          // Standard links
          return (
            <NavLink key={to} to={to} className={getLinkClassName}>
              <Icon size={24} />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;