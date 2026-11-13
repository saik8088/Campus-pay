import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, QrCode, Check, Copy } from 'lucide-react';

export default function QRModal({ stall, onClose }) {
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    modalRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const upiId = stall.upiId || `${stall.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@campuspay`;
  const qrImage = stall.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(stall.name)}&cu=INR`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      style={{ backgroundColor: 'rgba(10, 16, 12, 0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-[#16221B] border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm fade-in focus:outline-none overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22C55E]/15 dark:bg-[#22C55E]/20 text-[#22C55E] rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 id="qr-modal-title" className="font-bold text-[#17211B] dark:text-white text-sm">
                Authorized UPI QR Code
              </h2>
              <p className="text-xs text-[#647067] dark:text-gray-400">{stall.name}</p>
            </div>
          </div>
          <button
            id="qr-modal-close"
            onClick={onClose}
            className="p-2 rounded-lg text-[#647067] dark:text-gray-400 hover:text-[#17211B] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close QR code modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Content */}
        <div className="p-5 text-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-[#22C55E]/25 shadow-sm inline-block mx-auto mb-3">
            <img
              src={qrImage}
              alt={`Authorized UPI QR code for ${stall.name}`}
              className="w-48 h-48 object-contain rounded-lg"
            />
          </div>

          {/* UPI ID Pill with Copy button */}
          <div className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-700 rounded-xl mb-3 text-left">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-semibold text-[#647067] dark:text-gray-400 block tracking-wide">
                UPI ID (VPA)
              </span>
              <span className="text-xs font-mono font-bold text-[#17211B] dark:text-white truncate block">
                {upiId}
              </span>
            </div>
            <button
              onClick={handleCopyUpi}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-xs font-medium text-[#17211B] dark:text-gray-200 hover:border-[#22C55E] transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span className="text-[#22C55E]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#647067] dark:text-gray-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 p-3 bg-[#22C55E]/5 dark:bg-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 text-left mb-4">
            <Shield className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
            <p className="text-xs text-[#647067] dark:text-gray-300">
              Confirm recipient name displays as <strong className="text-[#17211B] dark:text-white">{stall.name}</strong> before approving the UPI payment.
            </p>
          </div>

          {/* Safety Instructions */}
          <div className="space-y-1.5 text-left">
            <h3 className="text-xs font-semibold text-[#17211B] dark:text-gray-200 uppercase tracking-wide">
              Quick Payment Safety
            </h3>
            {[
              'Scan with GPay, PhonePe, Paytm, or any UPI app',
              'Verify the recipient and amount before entering UPI PIN',
              'Confirm success status inside your UPI app',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#22C55E] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="text-xs text-[#647067] dark:text-gray-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
