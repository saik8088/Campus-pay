import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, Loader2,
  Sun, Moon, Zap, Shield, Store
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AmbientBackground from '../components/AmbientBackground';

export default function LoginPage() {
  const { login, loginDemo } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#F7F9F7] dark:bg-[#0c130f] flex flex-col items-center justify-start sm:justify-center py-8 sm:py-16 px-4 overflow-y-auto transition-colors duration-200">
      <AmbientBackground />

      {/* Theme Switcher at top right */}
      <div className="fixed top-4 right-4 z-30">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md text-gray-600 dark:text-gray-300 hover:text-[#22C55E] dark:hover:text-[#22C55E] shadow-sm transition-all cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
        </button>
      </div>

      {/* Background Floating Decorative Badges (Hidden on small viewports) */}
      <div className="hidden 2xl:flex items-center gap-2.5 absolute top-28 left-16 px-4 py-3 rounded-2xl bg-white/80 dark:bg-[#16221B]/85 backdrop-blur-md border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-float-slow select-none pointer-events-none z-10">
        <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 flex items-center justify-center text-[#22C55E]">
          <Store className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-[#17211B] dark:text-white block">Stall Dashboard</span>
          <span className="text-[11px] text-[#647067] dark:text-gray-400">Update UPI & Status live</span>
        </div>
      </div>

      <div className="hidden 2xl:flex items-center gap-2.5 absolute bottom-24 right-16 px-4 py-3 rounded-2xl bg-white/80 dark:bg-[#16221B]/85 backdrop-blur-md border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-float-reverse select-none pointer-events-none z-10">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-500">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-[#17211B] dark:text-white block">Owner Portal</span>
          <span className="text-[11px] text-[#647067] dark:text-gray-400">Protected Campus Access</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm my-auto">
        {/* Logo & Heading */}
        <div className="text-center mb-6 pt-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <img
              src="/campuspay-mark.png"
              alt=""
              className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold text-[#17211B] dark:text-white">
              Campus<span className="text-[#22C55E]">Pay</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#17211B] dark:text-white tracking-tight">Stall Owner Login</h1>
          <p className="text-sm text-[#647067] dark:text-gray-400 mt-1">Manage your campus stall information</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 dark:bg-[#16221B]/95 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-xl p-6 transition-colors">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                Email Address
              </label>
              <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-colors ${
                errors.email
                  ? 'border-[#EF4444] bg-red-50/50 dark:bg-red-950/20'
                  : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 focus-within:border-[#22C55E] dark:focus-within:border-[#22C55E]'
              }`}>
                <Mail className="w-4 h-4 text-[#647067] dark:text-gray-400 shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="owner@campus.edu"
                  className="flex-1 bg-transparent text-sm text-[#17211B] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                Password
              </label>
              <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition-colors ${
                errors.password
                  ? 'border-[#EF4444] bg-red-50/50 dark:bg-red-950/20'
                  : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/50 focus-within:border-[#22C55E] dark:focus-within:border-[#22C55E]'
              }`}>
                <Lock className="w-4 h-4 text-[#647067] dark:text-gray-400 shrink-0" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-sm text-[#17211B] dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#647067] dark:text-gray-400 hover:text-emerald-500 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-[#EF4444] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#22C55E] text-white rounded-xl font-semibold text-sm hover:bg-[#16A34A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick demo entrance */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <button
              id="demo-login-btn"
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#22C55E]/60 text-[#22C55E] text-xs font-semibold hover:bg-[#22C55E]/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Quick Demo Login
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-[#647067] dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/dashboard/register" className="text-[#22C55E] font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#647067] dark:text-gray-400 mt-5 pb-4">
          <Link to="/" className="hover:text-[#22C55E] transition-colors">
            ← Back to CampusPay
          </Link>
        </p>
      </div>
    </div>
  );
}
