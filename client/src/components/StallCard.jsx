import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, CheckCircle, XCircle, ChevronRight
} from 'lucide-react';
import { getStallImage } from '../data/stalls';

const categoryColors = {
  'Food & Beverages': { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-400' },
  'Beverages': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-400' },
  'Stationery & Supplies': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-400' },
};

const defaultColor = { bg: 'bg-gray-50 dark:bg-neutral-800', text: 'text-gray-600 dark:text-gray-300', dot: 'bg-gray-400' };

export default function StallCard({ stall }) {
  const colors = categoryColors[stall.category] || defaultColor;
  const stallImage = getStallImage(stall);

  return (
    <article className="group bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm card-hover overflow-hidden transition-all">
      {/* Visual Header with Real Photo */}
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-neutral-800">
        <img
          src={stallImage}
          alt={stall.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* Dark gradient overlay so badges pop clearly */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/35 pointer-events-none" />

        {/* Open/Closed badge */}
        <div
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
            stall.isOpen
              ? 'bg-[#22C55E]/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              stall.isOpen ? 'bg-white pulse-green' : 'bg-white'
            }`}
          />
          {stall.isOpen ? 'Open' : 'Closed'}
        </div>

        {/* Demo badge */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-[#F59E0B] text-xs font-medium rounded-full border border-[#F59E0B]/30 shadow-xs">
          Demo
        </div>
      </div>

      <div className="p-4">
        {/* Category */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} mb-3`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {stall.category}
        </div>

        {/* Name */}
        <h3 className="font-bold text-[#17211B] dark:text-white text-base mb-1 leading-tight group-hover:text-[#22C55E] transition-colors">
          {stall.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-[#647067] dark:text-gray-400 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span>{stall.location}</span>
        </div>

        {/* Payment methods */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              stall.acceptsUPI
                ? 'bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E]'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500'
            }`}
          >
            {stall.acceptsUPI
              ? <CheckCircle className="w-3 h-3" />
              : <XCircle className="w-3 h-3" />
            }
            UPI
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
              stall.acceptsCash
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500'
            }`}
          >
            {stall.acceptsCash
              ? <CheckCircle className="w-3 h-3" />
              : <XCircle className="w-3 h-3" />
            }
            Cash
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/stalls/${stall._id}`}
          id={`stall-card-${stall._id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#17211B] dark:bg-[#22C55E] text-white text-sm font-medium hover:bg-[#22C55E] dark:hover:bg-[#16A34A] transition-colors shadow-xs cursor-pointer"
        >
          View Payment Options
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
