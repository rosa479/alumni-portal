// src/components/Header.jsx
import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h2 className="text-xl font-bold text-primary-blue">IITKGP Connect</h2>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-dark-text font-medium hover:text-primary-blue transition-colors">Dashboard</a>
          <a href="#" className="text-dark-text font-medium hover:text-primary-blue transition-colors">Communities</a>
          <a href="#" className="text-dark-text font-medium hover:text-primary-blue transition-colors">Profile</a>
          <a href="#" className="text-dark-text font-medium hover:text-primary-blue transition-colors">Donate</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;