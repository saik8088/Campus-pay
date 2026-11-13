import React from 'react';
import { Link } from 'react-router-dom';
import {
  Info, Users, Store, Shield, CheckCircle, XCircle,
  Smartphone, HelpCircle, ArrowRight, Heart
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const CAPABILITIES = [
  { can: true, text: 'Show which payment methods a stall accepts' },
  { can: true, text: 'Display authorized UPI QR codes for stalls' },
  { can: true, text: 'Provide step-by-step payment guidance' },
  { can: true, text: 'Help troubleshoot pending or failed payments' },
  { can: true, text: 'Let stall owners manage their stall information' },
  { can: false, text: 'Process payments or receive money' },
  { can: false, text: 'Verify transaction status from payment providers' },
  { can: false, text: 'Guarantee refunds or specific refund timelines' },
  { can: false, text: 'Store your UPI PIN or banking credentials' },
];

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#647067] dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#22C55E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#17211B] dark:text-white font-medium">About</span>
        </div>

        {/* Hero */}
        <div className="bg-[#17211B] dark:bg-[#101813] border border-transparent dark:border-neutral-800 rounded-2xl p-8 mb-6 text-center">
          <div className="w-14 h-14 bg-[#22C55E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">About CampusPay</h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
            A campus payment companion built to reduce confusion at stalls — 
            not to replace your UPI app, but to help you use it smarter.
          </p>
        </div>

        {/* Problem */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 mb-5 transition-colors">
          <h2 className="font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#22C55E]" />
            The Problem
          </h2>
          <div className="space-y-3 text-sm text-[#647067] dark:text-gray-300 leading-relaxed">
            <p>
              Paying at campus stalls sounds simple, but students frequently face these situations:
            </p>
            <ul className="space-y-2 pl-4">
              {[
                "Not knowing whether a stall accepts UPI or cash before joining the queue",
                "Struggling to find the correct authorized QR code",
                "Experiencing slow internet and not knowing whether a transaction went through",
                "Money being deducted without the stall owner receiving it",
                "Not knowing what to do when a payment is pending",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Students */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 mb-5 transition-colors">
          <h2 className="font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#22C55E]" />
            How It Helps Students
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Smartphone, text: 'Check payment methods before queuing' },
              { icon: Shield, text: 'Access authorized QR codes safely' },
              { icon: HelpCircle, text: 'Get guidance on pending or failed payments' },
              { icon: CheckCircle, text: 'Know the safe payment checklist' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 p-3 bg-[#F7F9F7] dark:bg-[#101813] rounded-xl">
                <div className="w-8 h-8 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#22C55E]" />
                </div>
                <span className="text-sm text-[#647067] dark:text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stall Owners */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 mb-5 transition-colors">
          <h2 className="font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#22C55E]" />
            How It Helps Stall Owners
          </h2>
          <ul className="space-y-2 text-sm text-[#647067] dark:text-gray-300">
            {[
              'Update accepted payment methods instantly',
              'Upload and manage your official UPI QR code',
              'Set your stalls open/closed status',
              'Reduce payment confusion and customer frustration',
              'Provide backup payment instructions for when UPI is unavailable',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Capabilities */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 mb-5 transition-colors">
          <h2 className="font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#22C55E]" />
            What CampusPay Can and Cannot Do
          </h2>
          <div className="space-y-2">
            {CAPABILITIES.map(({ can, text }) => (
              <div key={text} className="flex items-start gap-2">
                {can
                  ? <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                }
                <span className={`text-sm ${can ? 'text-[#17211B] dark:text-gray-200' : 'text-[#647067] dark:text-gray-400'}`}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* UPI App reminder */}
        <div className="p-5 bg-[#22C55E]/5 dark:bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl mb-6">
          <h3 className="font-semibold text-[#17211B] dark:text-white text-sm mb-2">
            Always verify in your UPI app
          </h3>
          <p className="text-xs text-[#647067] dark:text-gray-300 leading-relaxed">
            Your UPI app (Google Pay, PhonePe, Paytm, BHIM, etc.) is the authoritative source for 
            any transaction status. CampusPay cannot see or verify your payment status. 
            If a payment shows as Pending or Failed in your UPI app, follow the guidance there — 
            do not retry until you know the first transaction's outcome.
          </p>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/stalls"
            className="flex items-center justify-between p-4 bg-[#17211B] dark:bg-[#22C55E] text-white rounded-2xl hover:bg-[#22C55E] dark:hover:bg-[#16A34A] transition-colors group shadow-xs"
          >
            <div>
              <div className="font-semibold text-sm">Explore Stalls</div>
              <div className="text-xs text-gray-400 group-hover:text-white/70 mt-0.5">Browse campus stalls</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/payment-help"
            className="flex items-center justify-between p-4 bg-white dark:bg-[#152019] border border-gray-200 dark:border-neutral-700 rounded-2xl hover:border-[#22C55E]/40 transition-colors group shadow-xs"
          >
            <div>
              <div className="font-semibold text-sm text-[#17211B] dark:text-white">Payment Help</div>
              <div className="text-xs text-[#647067] dark:text-gray-400 mt-0.5">Troubleshoot issues</div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#647067] dark:text-gray-400 group-hover:text-[#22C55E] transition-colors" />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
