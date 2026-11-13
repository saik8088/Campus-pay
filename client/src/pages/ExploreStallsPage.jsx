import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Store, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StallCard from '../components/StallCard';
import { DEMO_STALLS } from '../data/stalls';
import { getStalls } from '../services/api';

const FILTERS = [
  { key: 'all', label: 'All Stalls' },
  { key: 'upi', label: 'UPI Available' },
  { key: 'cash', label: 'Cash Accepted' },
  { key: 'open', label: 'Currently Open' },
];

export default function ExploreStallsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stalls, setStalls] = useState(DEMO_STALLS);
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [backendConnected, setBackendConnected] = useState(null);

  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  // Try to fetch from backend; fall back to demo data
  useEffect(() => {
    const fetchStalls = async () => {
      setLoading(true);
      const savedCustom = localStorage.getItem('campuspay_custom_stalls');
      const customStalls = savedCustom ? JSON.parse(savedCustom) : [];
      try {
        const res = await getStalls();
        const apiStalls = res.data || [];
        const ids = new Set(apiStalls.map((s) => s._id));
        const unmerged = customStalls.filter((s) => !ids.has(s._id));
        setStalls([...unmerged, ...apiStalls]);
        setBackendConnected(true);
        setIsDemo(res.headers['x-campuspay-data-source'] !== 'database');
      } catch {
        // Backend not available — use demo data + custom stalls
        setStalls([...customStalls, ...DEMO_STALLS]);
        setBackendConnected(false);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStalls();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (activeFilter !== 'all') params.filter = activeFilter;
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeFilter]);

  const filteredStalls = useMemo(() => {
    let results = stalls;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter
    if (activeFilter === 'upi') results = results.filter((s) => s.acceptsUPI);
    if (activeFilter === 'cash') results = results.filter((s) => s.acceptsCash);
    if (activeFilter === 'open') results = results.filter((s) => s.isOpen);

    return results;
  }, [stalls, searchQuery, activeFilter]);

  const clearSearch = () => {
    setSearchQuery('');
    setActiveFilter('all');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#647067] dark:text-gray-400 mb-2">
            <Link to="/" className="hover:text-[#22C55E] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#17211B] dark:text-gray-200 font-medium">Explore Stalls</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17211B] dark:text-white mb-1">Campus Stalls</h1>
          <p className="text-sm text-[#647067] dark:text-gray-400">
            Browse stalls, check payment methods, and access authorized QR codes.
          </p>
        </div>

        {/* Demo Notice */}
        {isDemo && (
          <div className="flex items-start gap-3 p-4 bg-[#F59E0B]/5 dark:bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl mb-6">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
            <p className="text-xs text-[#647067] dark:text-gray-300">
              <strong className="text-[#17211B] dark:text-white">Demo Mode:</strong>{' '}
              {loading || backendConnected === null
                ? 'Connecting to the backend...'
                : backendConnected
                  ? 'The backend is connected, but MongoDB is not. Configure MONGODB_URI in server/.env to load real stalls.'
                  : 'The backend API is unavailable. Start it with npm run dev from the client directory to load stalls.'}
            </p>
          </div>
        )}

        {/* Search + Filters */}
        <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-4 mb-6 transition-colors">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#F7F9F7] dark:bg-[#0e1612] border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 mb-4 transition-colors">
            <Search className="w-4 h-4 text-[#647067] dark:text-gray-400 shrink-0" />
            <input
              id="stalls-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, or location..."
              className="stalls-search-input flex-1 bg-transparent text-sm text-[#17211B] dark:text-white placeholder:text-[#647067] dark:placeholder:text-gray-400 focus:outline-none"
              aria-label="Search stalls"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-[#647067] dark:text-gray-400 hover:text-[#EF4444] transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-[#647067] dark:text-gray-400 shrink-0" />
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                id={`filter-${key}`}
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === key
                    ? 'bg-[#22C55E] text-white shadow-sm'
                    : 'bg-[#F7F9F7] dark:bg-[#0e1612] text-[#647067] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#647067] dark:text-gray-400">
            {loading ? 'Loading...' : `${filteredStalls.length} stall${filteredStalls.length !== 1 ? 's' : ''} found`}
          </p>
          {(searchQuery || activeFilter !== 'all') && (
            <button
              onClick={clearSearch}
              className="text-xs text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 h-64 animate-pulse" />
            ))}
          </div>
        ) : filteredStalls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredStalls.map((stall) => (
              <StallCard key={stall._id} stall={stall} />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="font-semibold text-[#17211B] dark:text-white mb-2">No stalls found</h3>
            <p className="text-sm text-[#647067] dark:text-gray-400 max-w-xs mx-auto mb-4">
              No stalls match "{searchQuery || activeFilter}". Try a different search term or remove a filter.
            </p>
            <button
              onClick={clearSearch}
              className="px-4 py-2 rounded-xl bg-[#22C55E] text-white text-sm font-medium hover:bg-[#16A34A] transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
