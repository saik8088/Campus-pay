import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard, CheckCircle, Shield, AlertTriangle, ChevronRight,
  Store, QrCode, Smartphone, Eye, ArrowRight
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const STEPS = [
  {
    icon: Store,
    title: 'Choose the Stall',
    desc: 'Browse campus stalls on CampusPay. Check the stall name, category, location, and opening status before walking over.',
    tip: null,
  },
  {
    icon: Smartphone,
    title: 'Check Accepted Payment Methods',
    desc: 'On the stall details page, see whether the stall accepts UPI, cash, or both. This saves time if you only have one option available.',
    tip: 'Some stalls accept UPI only — make sure your UPI app is set up and working before you order.',
  },
  {
    icon: QrCode,
    title: 'Open the Authorized QR Code',
    desc: 'If the stall accepts UPI, tap "View UPI QR Code" on the stall details page. Only use the QR code displayed here or physically shown by the stall owner.',
    tip: 'Never scan QR codes from unknown sources. Always verify the recipient name in your UPI app.',
  },
  {
    icon: Eye,
    title: 'Verify Recipient and Amount',
    desc: 'Before tapping Pay in your UPI app, confirm the recipient name matches the stall and that the amount is correct.',
    tip: 'This is the most important step. Do not rush.',
  },
  {
    icon: CreditCard,
    title: 'Complete the Transaction',
    desc: 'Enter your UPI PIN and confirm the payment in your UPI app. CampusPay does not process or verify payments — all transactions happen entirely inside your UPI app.',
    tip: null,
  },
  {
    icon: CheckCircle,
    title: 'Check the Final Transaction Status',
    desc: 'After paying, confirm that your UPI app shows a "Success" status. If it shows "Pending", wait and check again before retrying. If it shows "Failed", see the Payment Help page.',
    tip: null,
  },
];

export default function PaymentGuidancePage() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#647067] dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#22C55E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#17211B] dark:text-white font-medium">Payment Guide</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] rounded-full text-xs font-medium mb-4 border border-[#22C55E]/20">
            <CreditCard className="w-3.5 h-3.5" />
            Step-by-step guide
          </div>
          <h1 className="text-2xl font-extrabold text-[#17211B] dark:text-white mb-2">
            How to Pay at Campus Stalls
          </h1>
          <p className="text-sm text-[#647067] dark:text-gray-300 leading-relaxed">
            Follow these steps for a smooth, confusion-free campus payment experience.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-[#22C55E]/5 dark:bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl mb-8">
          <Shield className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
          <p className="text-xs text-[#647067] dark:text-gray-300">
            <strong className="text-[#17211B] dark:text-white">Important:</strong> CampusPay is a payment information platform. 
            It does not process transactions or verify payment status. All payments are completed in your UPI app.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {STEPS.map(({ icon: Icon, title, desc, tip }, index) => {
            const step = index + 1;
            const isActive = activeStep === step;
            return (
              <div
                key={step}
                className={`bg-white dark:bg-[#152019] rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#22C55E]/40 dark:border-[#22C55E]/50 shadow-sm'
                    : 'border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700'
                }`}
                onClick={() => setActiveStep(isActive ? null : step)}
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Step number */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                        isActive
                          ? 'bg-[#22C55E] text-white'
                          : 'bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E]'
                      }`}
                    >
                      {step}
                    </div>
                    {step < STEPS.length && (
                      <div className="w-0.5 h-4 bg-gray-100 dark:bg-neutral-800" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#22C55E]' : 'text-[#647067] dark:text-gray-400'}`} />
                      <h3 className="font-semibold text-[#17211B] dark:text-white text-sm">{title}</h3>
                    </div>
                    <p className="text-sm text-[#647067] dark:text-gray-300 leading-relaxed">{desc}</p>

                    {isActive && tip && (
                      <div className="mt-3 flex items-start gap-2 p-3 bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] mt-0.5 shrink-0" />
                        <p className="text-xs text-[#647067] dark:text-gray-300">{tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Summary Card */}
        <div className="bg-[#17211B] dark:bg-[#101813] border border-transparent dark:border-neutral-800 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-white mb-4">Quick Checklist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              'Stall accepts my payment method',
              'QR code shows correct stall name',
              'Amount entered is correct',
              'UPI app shows transaction result',
              'Status is confirmed (not pending)',
              'Receipt visible in UPI app',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Help CTA */}
        <Link
          to="/payment-help"
          id="guidance-help-link"
          className="flex items-center justify-between p-5 bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:border-[#22C55E]/40 transition-colors group"
        >
          <div>
            <div className="font-semibold text-[#17211B] dark:text-white text-sm mb-0.5">Something went wrong?</div>
            <div className="text-xs text-[#647067] dark:text-gray-400">Get help for pending, failed, or unclear transactions.</div>
          </div>
          <div className="flex items-center gap-1 text-[#22C55E] text-sm font-medium">
            Payment Help
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </MainLayout>
  );
}
