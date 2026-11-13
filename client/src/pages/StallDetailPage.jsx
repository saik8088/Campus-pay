import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Smartphone, Banknote, QrCode, HelpCircle,
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, Shield,
  ChevronRight, Store, AlertCircle
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import QRModal from '../components/QRModal';
import { DEMO_STALLS, getStallImage } from '../data/stalls';
import { getStall } from '../services/api';

const SAFETY_STEPS = [
  'Verify the recipient name shown in your UPI app before completing payment.',
  'Enter the correct amount — double-check before tapping Pay.',
  'Confirm the transaction result inside your UPI app after payment.',
  'If the status shows Pending, check it before attempting another payment.',
];


export default function StallDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchStall = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getStall(id);
        setStall(res.data);
      } catch {
        const customStalls = JSON.parse(localStorage.getItem('campuspay_custom_stalls') || '[]');
        const demo = DEMO_STALLS.find((s) => s._id === id) || customStalls.find((s) => s._id === id);
        if (demo) {
          setStall(demo);
        } else {
          setError('Stall not found.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStall();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4" />
            <div className="h-48 bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
            <div className="h-32 bg-gray-200 dark:bg-neutral-800 rounded-2xl" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !stall) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          </div>
          <h1 className="text-xl font-bold text-[#17211B] dark:text-white mb-2">Stall Not Found</h1>
          <p className="text-sm text-[#647067] dark:text-gray-400 mb-6">{error || 'This stall does not exist.'}</p>
          <Link
            to="/stalls"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-medium hover:bg-[#16A34A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Stalls
          </Link>
        </div>
      </MainLayout>
    );
  }

  const stallImage = getStallImage(stall);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#647067] dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-[#22C55E] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/stalls" className="hover:text-[#22C55E] transition-colors">Stalls</Link>
          <span>/</span>
          <span className="text-[#17211B] dark:text-white font-medium">{stall.name}</span>
        </div>

        {/* Hero Card with Real Photo */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm overflow-hidden mb-5 transition-colors">
          <div className="relative h-48 sm:h-64 overflow-hidden bg-gray-100 dark:bg-neutral-800">
            <img
              src={stallImage}
              alt={stall.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {/* Dark gradient overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35 pointer-events-none" />

            {/* Status badge */}
            <div
              className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
                stall.isOpen
                  ? 'bg-[#22C55E]/95 text-white'
                  : 'bg-red-500/95 text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stall.isOpen ? 'bg-white pulse-green' : 'bg-white'}`} />
              {stall.isOpen ? 'Currently Open' : 'Currently Closed'}
            </div>
          </div>

          <div className="p-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] rounded-full font-medium">
                {stall.category}
              </span>
              <span className="text-xs px-2.5 py-1 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 text-[#F59E0B] rounded-full font-medium">
                Demo Data
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#17211B] dark:text-white mt-2">{stall.name}</h1>
            <div className="flex items-center gap-1.5 mt-1.5 text-[#647067] dark:text-gray-400 text-sm">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{stall.location}</span>
            </div>
            {stall.timing && (
              <div className="flex items-center gap-1.5 mt-1 text-[#647067] dark:text-gray-400 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{stall.timing}</span>
              </div>
            )}
            {stall.description && (
              <p className="text-sm text-[#647067] dark:text-gray-300 mt-3 leading-relaxed">{stall.description}</p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-5 mb-5 transition-colors">
          <h2 className="font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#22C55E]" />
            Accepted Payment Methods
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                stall.acceptsUPI
                  ? 'border-[#22C55E]/30 bg-[#22C55E]/5 dark:bg-[#22C55E]/10'
                  : 'border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/40 opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stall.acceptsUPI ? 'bg-[#22C55E]/15' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                <Smartphone className={`w-5 h-5 ${stall.acceptsUPI ? 'text-[#22C55E]' : 'text-gray-400'}`} />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#17211B] dark:text-white">UPI Payment</div>
                <div className={`flex items-center gap-1 text-xs mt-0.5 ${stall.acceptsUPI ? 'text-[#22C55E]' : 'text-gray-400'}`}>
                  {stall.acceptsUPI
                    ? <><CheckCircle className="w-3 h-3" /> Accepted</>
                    : <><XCircle className="w-3 h-3" /> Not accepted</>
                  }
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-4 rounded-xl border ${
                stall.acceptsCash
                  ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/40 opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stall.acceptsCash ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                <Banknote className={`w-5 h-5 ${stall.acceptsCash ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#17211B] dark:text-white">Cash</div>
                <div className={`flex items-center gap-1 text-xs mt-0.5 ${stall.acceptsCash ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                  {stall.acceptsCash
                    ? <><CheckCircle className="w-3 h-3" /> Accepted</>
                    : <><XCircle className="w-3 h-3" /> Not accepted</>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {stall.acceptsUPI && (
          <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-5 mb-5 transition-colors">
            <h2 className="font-bold text-[#17211B] dark:text-white mb-1 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#22C55E]" />
              UPI QR Code
            </h2>
            <p className="text-xs text-[#647067] dark:text-gray-400 mb-4">
              Use the authorized QR code for this stall. Verify the recipient name in your UPI app before paying.
            </p>
            <button
              id="view-qr-btn"
              onClick={() => setShowQR(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#17211B] dark:bg-[#22C55E] text-white rounded-xl font-medium text-sm hover:bg-[#22C55E] dark:hover:bg-[#16A34A] transition-colors cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4" />
              View UPI QR Code
            </button>
          </div>
        )}

        {/* Safety Instructions */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-5 mb-5 transition-colors">
          <h2 className="font-bold text-[#17211B] dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#22C55E]" />
            Safe Payment Instructions
          </h2>
          <div className="space-y-3">
            {SAFETY_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#22C55E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-[#647067] dark:text-gray-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Backup Instructions */}
        {stall.backupPaymentInstructions && (
          <div className="bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-2xl p-5 mb-5 transition-colors">
            <h2 className="font-bold text-[#17211B] dark:text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
              Backup Payment Option
            </h2>
            <p className="text-sm text-[#647067] dark:text-gray-300">{stall.backupPaymentInstructions}</p>
          </div>
        )}

        {/* Help Link */}
        <Link
          to="/payment-help"
          id="stall-help-btn"
          className="flex items-center justify-between w-full p-5 bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:border-[#22C55E]/40 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E]/10 dark:bg-[#22C55E]/20 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <div className="font-semibold text-[#17211B] dark:text-white text-sm">Payment Help</div>
              <div className="text-xs text-[#647067] dark:text-gray-400">Pending, failed, or deducted? Get help here.</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#647067] dark:text-gray-400 group-hover:text-[#22C55E] transition-colors" />
        </Link>
      </div>

      {/* QR Modal */}
      {showQR && <QRModal stall={stall} onClose={() => setShowQR(false)} />}
    </MainLayout>
  );
}
