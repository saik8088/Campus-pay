import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu, X, Home, Store, CreditCard,
  HelpCircle, Info, LayoutDashboard, ChevronRight,
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/stalls', label: 'Explore Stalls', icon: Store },
  { to: '/payment-guidance', label: 'Payment Guide', icon: CreditCard },
  { to: '/payment-help', label: 'Payment Help', icon: HelpCircle },
  { to: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0E1612]/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-neutral-800'
          : 'bg-white dark:bg-[#0E1612] border-b border-gray-100 dark:border-neutral-800'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="CampusPay Home"
          >
            <img
              src="/campuspay-mark.png"
              alt=""
              className="w-8 h-8 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
            <span className="text-lg font-bold text-[#17211B] dark:text-white tracking-tight">
              Campus<span className="text-[#22C55E]">Pay</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E]'
                      : 'text-[#647067] dark:text-gray-300 hover:text-[#17211B] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right: Theme Toggle & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/80 text-gray-600 dark:text-gray-300 hover:text-[#22C55E] dark:hover:text-[#22C55E] hover:border-[#22C55E]/40 transition-all cursor-pointer shadow-xs"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </button>

            {isAuthenticated ? (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#17211B] dark:bg-emerald-600 text-white'
                      : 'bg-[#17211B] dark:bg-emerald-600 text-white hover:bg-[#22C55E]'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/dashboard/login"
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-[#22C55E] text-white hover:bg-[#16A34A] transition-colors shadow-sm"
              >
                Stall Owner Login
                <ChevronRight className="w-4 h-4" />
              </NavLink>
            )}
          </div>

          {/* Mobile menu and Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              id="mobile-menu-toggle"
              className="p-2 rounded-lg text-[#647067] dark:text-gray-300 hover:text-[#17211B] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 dark:border-neutral-800 mt-2 fade-in">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E]'
                        : 'text-[#647067] dark:text-gray-300 hover:text-[#17211B] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 mt-2">
                {isAuthenticated ? (
                  <NavLink
                    to="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-[#17211B] dark:bg-emerald-600 text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                ) : (
                  <NavLink
                    to="/dashboard/login"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-[#22C55E] text-white"
                  >
                    Stall Owner Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
