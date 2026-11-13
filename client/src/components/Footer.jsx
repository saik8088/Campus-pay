import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#17211B] dark:bg-[#070b09] text-white border-t border-transparent dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/campuspay-mark.png"
                alt=""
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-lg font-bold">
                Campus<span className="text-[#22C55E]">Pay</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Know before you pay. CampusPay helps students find campus stalls, 
              check accepted payment methods, and troubleshoot payment issues.
            </p>
            <div className="mt-4 flex items-start gap-2 p-3 bg-[#22C55E]/10 rounded-lg border border-[#22C55E]/20">
              <Shield className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
              <p className="text-xs text-gray-400">
                CampusPay is a <strong className="text-white">payment information and guidance platform</strong>. 
                It does not process payments or store financial credentials.
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/stalls', label: 'Explore Stalls' },
                { to: '/payment-guidance', label: 'Payment Guide' },
                { to: '/payment-help', label: 'Payment Help' },
                { to: '/about', label: 'About' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-[#22C55E] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Help</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/payment-help#pending', label: 'Pending Payment' },
                { to: '/payment-help#deducted', label: 'Money Deducted' },
                { to: '/payment-help#qr', label: 'QR Not Working' },
                { to: '/payment-help#failed', label: 'Payment Failed' },
                { to: '/dashboard/login', label: 'Stall Owner Login' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-[#22C55E] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CampusPay. Demo application — not affiliated with any financial institution.
          </p>
          <p className="text-xs text-gray-500">
            Made for campus communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
