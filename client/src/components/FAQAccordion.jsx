import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ faq, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`bg-white dark:bg-[#152019] rounded-2xl border transition-all ${
        isOpen
          ? 'border-[#22C55E]/30 dark:border-[#22C55E]/50 shadow-sm'
          : 'border-gray-100 dark:border-neutral-800'
      }`}
    >
      <button
        id={`faq-btn-${faq.id}`}
        className="w-full flex items-start justify-between gap-4 p-5 text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-content-${faq.id}`}
      >
        <span className="font-semibold text-[#17211B] dark:text-white text-sm leading-snug flex-1">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#647067] dark:text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#22C55E] dark:text-[#22C55E]' : ''
          }`}
        />
      </button>

      <div
        id={`faq-content-${faq.id}`}
        role="region"
        aria-labelledby={`faq-btn-${faq.id}`}
        style={{ maxHeight: `${height}px`, overflow: 'hidden', transition: 'max-height 0.3s ease' }}
      >
        <div ref={contentRef} className="px-5 pb-5">
          <div className="space-y-2.5">
            {faq.answer.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-[#647067] dark:text-gray-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
