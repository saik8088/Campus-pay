import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HelpCircle, Search, X, Clock, AlertTriangle, Wifi,
  XCircle, QrCode, Shield, Info, ChevronDown
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import FAQAccordion from '../components/FAQAccordion';
import { FAQ_DATA } from '../data/faq';

const CATEGORY_ICONS = {
  pending: Clock,
  deducted: AlertTriangle,
  qr: QrCode,
  internet: Wifi,
  failed: XCircle,
  general: HelpCircle,
};

const CATEGORY_COLORS = {
  pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  deducted: 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/40',
  qr: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40',
  internet: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40',
  failed: 'bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/40',
  general: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
};

const CATEGORY_LABELS = {
  pending: 'Pending Payment',
  deducted: 'Money Deducted',
  qr: 'QR Not Working',
  internet: 'Slow Internet',
  failed: 'Payment Failed',
  general: 'General',
};

const QUICK_CATEGORIES = ['all', 'pending', 'deducted', 'qr', 'internet', 'failed', 'general'];

export default function PaymentHelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const location = useLocation();

  // Handle hash navigation
  React.useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash && QUICK_CATEGORIES.includes(hash)) {
      setActiveCategory(hash);
    }
  }, [location]);

  const filteredFAQs = useMemo(() => {
    let results = FAQ_DATA;

    if (activeCategory !== 'all') {
      results = results.filter((f) => f.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.some((a) => a.toLowerCase().includes(q)) ||
          f.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  }, [searchQuery, activeCategory]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#647067] dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#22C55E] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#17211B] dark:text-white font-medium">Payment Help</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EF4444]/10 dark:bg-[#EF4444]/20 text-[#EF4444] rounded-full text-xs font-medium mb-4 border border-[#EF4444]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            Troubleshooting Guide
          </div>
          <h1 className="text-2xl font-extrabold text-[#17211B] dark:text-white mb-2">Payment Help</h1>
          <p className="text-sm text-[#647067] dark:text-gray-300 leading-relaxed">
            Having trouble with a campus stall payment? Find answers below.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 bg-[#22C55E]/5 dark:bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl mb-6">
          <Shield className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
          <p className="text-xs text-[#647067] dark:text-gray-300">
            <strong className="text-[#17211B] dark:text-white">Disclaimer:</strong> CampusPay does not process payments and cannot verify transaction status. 
            For refunds or disputes, contact your UPI provider's official support channel. 
            We do not promise specific refund timelines.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#152019] border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 mb-4 focus-within:border-[#22C55E] dark:focus-within:border-[#22C55E] transition-colors shadow-sm">
          <Search className="w-4 h-4 text-[#647067] dark:text-gray-400 shrink-0" />
          <input
            id="help-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search: pending, failed, QR code, money deducted..."
            className="flex-1 bg-transparent text-sm text-[#17211B] dark:text-white placeholder:text-[#647067] dark:placeholder:text-gray-400 focus:outline-none"
            aria-label="Search payment help topics"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="cursor-pointer">
              <X className="w-4 h-4 text-[#647067] dark:text-gray-400 hover:text-[#EF4444]" />
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || HelpCircle;
            const colorClass = CATEGORY_COLORS[cat] || '';
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`help-cat-${cat}`}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                  isActive
                    ? cat === 'all'
                      ? 'bg-[#22C55E] text-white border-[#22C55E]'
                      : colorClass + ' font-semibold'
                    : 'bg-white dark:bg-[#152019] text-[#647067] dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                }`}
              >
                {cat !== 'all' && <Icon className="w-3 h-3" />}
                {cat === 'all' ? 'All Topics' : CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#647067] dark:text-gray-400">
            {filteredFAQs.length} topic{filteredFAQs.length !== 1 ? 's' : ''} found
          </p>
          {(searchQuery || activeCategory !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="text-xs text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3 mb-8">
            {filteredFAQs.map((faq) => (
              <FAQAccordion
                key={faq.id}
                faq={faq}
                isOpen={openFaq === faq.id}
                onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800">
            <HelpCircle className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <h3 className="font-semibold text-[#17211B] dark:text-white mb-1">No results found</h3>
            <p className="text-sm text-[#647067] dark:text-gray-400">Try different search terms or browse all topics.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 text-sm text-[#22C55E] border border-[#22C55E]/30 rounded-lg hover:bg-[#22C55E]/10 transition-colors cursor-pointer"
            >
              Browse All Topics
            </button>
          </div>
        )}

        {/* Emergency tip */}
        <div className="p-5 bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-[#17211B] dark:text-white text-sm mb-1">General Rule of Thumb</h3>
              <p className="text-xs text-[#647067] dark:text-gray-300 leading-relaxed">
                Before retrying any payment, always check the transaction status in your UPI app first. 
                Double payments can happen if you pay again before confirming the first transaction failed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
