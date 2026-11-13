import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, Store, QrCode, HelpCircle,
  CheckCircle, Shield, Smartphone, Banknote, ChevronRight,
  Star, Clock, MapPin, Zap
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StallCard from '../components/StallCard';
import HeroBackgroundAnimation from '../components/HeroBackgroundAnimation';
import { DEMO_STALLS } from '../data/stalls';

const HOW_IT_WORKS = [
  {
    icon: Store,
    step: '01',
    title: 'Find Your Stall',
    desc: 'Browse campus stalls and check which payment methods they accept before you queue up.',
  },
  {
    icon: QrCode,
    step: '02',
    title: 'Access the QR Code',
    desc: 'Open the authorized UPI QR code for the stall directly from the app. No hunting for a printed code.',
  },
  {
    icon: HelpCircle,
    step: '03',
    title: 'Get Payment Help',
    desc: 'Payment stuck or failed? Follow the step-by-step troubleshooting guide to resolve it quickly.',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stalls?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/stalls');
    }
  };

  const customStalls = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('campuspay_custom_stalls') || '[]')
    : [];
  const featuredStalls = [...customStalls, ...DEMO_STALLS].slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0b120e] border-b border-gray-100 dark:border-neutral-800 transition-colors">
        <HeroBackgroundAnimation />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] rounded-full text-sm font-medium mb-6 border border-[#22C55E]/20">
              <Zap className="w-3.5 h-3.5" />
              Campus Payment Companion
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17211B] dark:text-white leading-tight mb-4 tracking-tight">
              Every Campus Payment,{' '}
              <span className="text-[#22C55E]">Without the Confusion.</span>
            </h1>

            <p className="text-[#647067] dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Know which stalls accept UPI or cash, find authorized QR codes, and get 
              step-by-step help when a transaction is pending, failed, or unclear.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-[#F7F9F7] dark:bg-[#152019] border border-gray-200 dark:border-neutral-700 rounded-2xl p-1.5 max-w-lg mx-auto mb-6 transition-all shadow-sm focus-within:border-[#22C55E] dark:focus-within:border-[#22C55E]"
            >
              <Search className="w-5 h-5 text-[#647067] dark:text-gray-400 ml-3 shrink-0" />
              <input
                id="hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search canteen, juice shop, stationery..."
                className="hero-search-input flex-1 bg-transparent text-[#17211B] dark:text-white placeholder:text-[#647067] dark:placeholder:text-gray-400 text-sm py-2 focus:outline-none"
                aria-label="Search campus stalls"
              />
              <button
                type="submit"
                id="hero-search-btn"
                className="px-4 py-2 bg-[#22C55E] text-white rounded-xl text-sm font-medium hover:bg-[#16A34A] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/stalls"
                id="explore-stalls-btn"
                className="flex items-center gap-2 px-6 py-3 bg-[#17211B] dark:bg-[#22C55E] text-white rounded-xl font-semibold text-sm hover:bg-[#22C55E] dark:hover:bg-[#16A34A] transition-colors shadow-sm"
              >
                <Store className="w-4 h-4" />
                Explore Campus Stalls
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/payment-help"
                id="payment-help-btn"
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#152019] text-[#17211B] dark:text-white rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-[#1d2c23] border border-gray-200 dark:border-neutral-700 transition-colors shadow-xs"
              >
                <HelpCircle className="w-4 h-4 text-[#22C55E]" />
                Get Payment Help
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#17211B] dark:bg-[#080d0a] py-6 border-b dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '4+', label: 'Campus Stalls' },
              { value: 'UPI', label: '& Cash Tracking' },
              { value: '5+', label: 'Help Scenarios' },
              { value: '100%', label: 'Free to Use' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-extrabold text-[#22C55E]">{value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Filters & Featured Stalls */}
      <section className="py-12 bg-[#F7F9F7] dark:bg-[#0c130f] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#17211B] dark:text-white">Featured Stalls</h2>
              <p className="text-sm text-[#647067] dark:text-gray-400 mt-1">Sample demonstration data — not actual campus businesses</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/stalls?filter=upi"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22C55E]/10 text-[#22C55E] rounded-lg text-xs font-medium hover:bg-[#22C55E]/20 transition-colors border border-[#22C55E]/20"
              >
                <Smartphone className="w-3.5 h-3.5" />
                UPI Available
              </Link>
              <Link
                to="/stalls?filter=cash"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors border border-blue-100 dark:border-blue-900/50"
              >
                <Banknote className="w-3.5 h-3.5" />
                Cash Accepted
              </Link>
              <Link
                to="/stalls?filter=open"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors border border-orange-100 dark:border-orange-900/50"
              >
                <Clock className="w-3.5 h-3.5" />
                Currently Open
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredStalls.map((stall) => (
              <StallCard key={stall._id} stall={stall} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/stalls"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#152019] text-[#17211B] dark:text-white text-sm font-medium hover:border-[#22C55E] dark:hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#22C55E] transition-colors shadow-xs"
            >
              View All Stalls
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white dark:bg-[#0e1612] border-t border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#17211B] dark:text-white mb-2">How CampusPay Works</h2>
            <p className="text-[#647067] dark:text-gray-400 text-sm max-w-md mx-auto">
              Three simple steps to pay at any campus stall with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="relative p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 bg-[#F7F9F7] dark:bg-[#152019] hover:border-[#22C55E]/30 dark:hover:border-[#22C55E]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 dark:bg-[#22C55E]/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#22C55E] tracking-widest">{step}</span>
                    <h3 className="font-bold text-[#17211B] dark:text-white mt-0.5 mb-2">{title}</h3>
                    <p className="text-sm text-[#647067] dark:text-gray-300 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-[#F7F9F7] dark:bg-[#0c130f] border-t border-gray-100 dark:border-neutral-800 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 p-5 bg-white dark:bg-[#152019] rounded-2xl border border-[#22C55E]/20 dark:border-[#22C55E]/30 shadow-xs">
            <Shield className="w-5 h-5 text-[#22C55E] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-[#17211B] dark:text-white text-sm mb-1">What CampusPay can and cannot do</h3>
              <p className="text-xs text-[#647067] dark:text-gray-300 leading-relaxed">
                CampusPay <strong>helps you discover payment options</strong> and provides guidance —  
                it is <strong>not a payment gateway</strong> and does not process, verify, or initiate transactions. 
                Always confirm payment status in your UPI app (Google Pay, PhonePe, etc.). 
                Never enter your UPI PIN or banking password on this platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
