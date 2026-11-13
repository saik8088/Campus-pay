import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AmbientBackground from '../components/AmbientBackground';

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F7F9F7] dark:bg-[#0c130f] text-[#17211B] dark:text-gray-100 transition-colors duration-200 overflow-x-hidden">
      <AmbientBackground />
      <Navbar />
      <main className="relative z-10 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
