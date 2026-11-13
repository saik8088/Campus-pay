import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Store, LogOut, Edit3, CheckCircle, XCircle,
  AlertCircle, Loader2, Save, Eye, Camera, MapPin, Clock,
  Smartphone, Banknote, Plus, Trash2, X, Image as ImageIcon, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOwnerStalls, updateStall, createStall, deleteStall } from '../services/api';
import { DEMO_STALLS, getStallImage, DEFAULT_STALL_IMAGES } from '../data/stalls';
import Navbar from '../components/Navbar';
import AmbientBackground from '../components/AmbientBackground';

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  const colors = type === 'success'
    ? 'bg-[#22C55E] text-white'
    : type === 'info'
    ? 'bg-[#17211B] text-white'
    : 'bg-[#EF4444] text-white';
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 fade-in ${colors}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  );
}

const PRESET_PHOTOS = [
  { label: 'Cafeteria / Food', url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80' },
  { label: 'Juice / Smoothies', url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Stationery & Books', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Café & Coffee', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Snacks & Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Add Stall State
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [addErrors, setAddErrors] = useState({});
  const [addForm, setAddForm] = useState({
    name: '',
    category: 'Food & Beverages',
    location: '',
    timing: '8:00 AM – 7:00 PM',
    description: '',
    imageUrl: '',
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: true,
    backupPaymentInstructions: 'Cash accepted if UPI network drops.',
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  // Load custom stalls from localStorage merged with API or demo stalls
  const getMergedStalls = (baseStalls) => {
    try {
      const saved = localStorage.getItem('campuspay_custom_stalls');
      const custom = saved ? JSON.parse(saved) : [];
      const ids = new Set(custom.map((s) => s._id));
      const filteredBase = baseStalls.filter((s) => !ids.has(s._id));
      return [...custom, ...filteredBase];
    } catch {
      return baseStalls;
    }
  };

  useEffect(() => {
    const fetchStalls = async () => {
      setLoading(true);
      try {
        const res = await getOwnerStalls();
        if (res.data && res.data.length > 0) {
          setStalls(getMergedStalls(res.data));
        } else {
          setStalls(getMergedStalls(DEMO_STALLS.slice(0, 2)));
        }
      } catch {
        setStalls(getMergedStalls(DEMO_STALLS.slice(0, 2)));
      } finally {
        setLoading(false);
      }
    };
    fetchStalls();
  }, []);

  // Save custom stalls to localStorage so they persist across sessions and appear on Explore Stalls
  const saveCustomStallsLocally = (updatedStalls) => {
    try {
      localStorage.setItem('campuspay_custom_stalls', JSON.stringify(updatedStalls));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  const startEdit = (stall) => {
    setEditingId(stall._id);
    setEditForm({
      name: stall.name,
      category: stall.category,
      location: stall.location,
      timing: stall.timing || '',
      description: stall.description || '',
      imageUrl: stall.imageUrl || '',
      isOpen: stall.isOpen,
      acceptsUPI: stall.acceptsUPI,
      acceptsCash: stall.acceptsCash,
      backupPaymentInstructions: stall.backupPaymentInstructions || '',
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setErrors({});
  };

  const validateEditForm = () => {
    const e = {};
    if (!editForm.name?.trim()) e.name = 'Stall name is required';
    if (!editForm.location?.trim()) e.location = 'Location is required';
    return e;
  };

  const handleSave = async (stallId) => {
    const errs = validateEditForm();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const res = await updateStall(stallId, editForm);
      const updated = stalls.map((s) => (s._id === stallId ? (res.data || { ...s, ...editForm }) : s));
      setStalls(updated);
      saveCustomStallsLocally(updated);
      setEditingId(null);
      showToast('Stall updated successfully!');
    } catch {
      const updated = stalls.map((s) => (s._id === stallId ? { ...s, ...editForm } : s));
      setStalls(updated);
      saveCustomStallsLocally(updated);
      setEditingId(null);
      showToast('Stall updated successfully!');
    } finally {
      setSaving(false);
    }
  };

  // Add New Stall Handler
  const validateAddForm = () => {
    const e = {};
    if (!addForm.name.trim()) e.name = 'Stall name is required';
    if (!addForm.location.trim()) e.location = 'Location is required';
    return e;
  };

  const handleCreateStallSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAddForm();
    if (Object.keys(errs).length > 0) {
      setAddErrors(errs);
      return;
    }
    setAddErrors({});
    setCreating(true);

    const stallToCreate = {
      _id: `stall-${Date.now()}`,
      name: addForm.name.trim(),
      category: addForm.category,
      location: addForm.location.trim(),
      timing: addForm.timing.trim(),
      description: addForm.description.trim(),
      imageUrl: addForm.imageUrl.trim() || DEFAULT_STALL_IMAGES[addForm.category] || DEFAULT_STALL_IMAGES['Food & Beverages'],
      isOpen: addForm.isOpen,
      acceptsUPI: addForm.acceptsUPI,
      acceptsCash: addForm.acceptsCash,
      backupPaymentInstructions: addForm.backupPaymentInstructions.trim(),
      ownerId: user?.id || 'owner',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await createStall(stallToCreate);
      const created = res.data || stallToCreate;
      const updatedList = [created, ...stalls];
      setStalls(updatedList);
      saveCustomStallsLocally(updatedList);
      showToast(`Stall "${created.name}" created successfully!`);
    } catch {
      // Local fallback
      const updatedList = [stallToCreate, ...stalls];
      setStalls(updatedList);
      saveCustomStallsLocally(updatedList);
      showToast(`Stall "${stallToCreate.name}" created successfully!`);
    } finally {
      setCreating(false);
      setShowAddModal(false);
      setAddForm({
        name: '',
        category: 'Food & Beverages',
        location: '',
        timing: '8:00 AM – 7:00 PM',
        description: '',
        imageUrl: '',
        isOpen: true,
        acceptsUPI: true,
        acceptsCash: true,
        backupPaymentInstructions: 'Cash accepted if UPI network drops.',
      });
    }
  };

  const handleDelete = async (stallId, stallName) => {
    if (!window.confirm(`Are you sure you want to remove "${stallName}"?`)) return;
    try {
      await deleteStall(stallId);
    } catch {
      // continue locally
    }
    const updated = stalls.filter((s) => s._id !== stallId);
    setStalls(updated);
    saveCustomStallsLocally(updated);
    showToast(`Stall "${stallName}" removed.`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleEditField = (field) =>
    setEditForm((f) => ({ ...f, [field]: !f[field] }));

  const toggleAddField = (field) =>
    setAddForm((f) => ({ ...f, [field]: !f[field] }));

  return (
    <div className="relative min-h-screen bg-[#F7F9F7] dark:bg-[#0c130f] text-[#17211B] dark:text-gray-100 overflow-x-hidden transition-colors duration-200">
      <AmbientBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-5 h-5 text-[#22C55E]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211B] dark:text-white">Owner Dashboard</h1>
              </div>
              <p className="text-sm text-[#647067] dark:text-gray-400">
                Welcome back, <strong className="text-[#17211B] dark:text-white">{user?.name || 'Owner'}</strong> · Manage your stalls and accepted payments
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                id="add-stall-btn"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#22C55E] text-white text-sm font-semibold hover:bg-[#16A34A] transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add New Stall
              </button>

              <button
                id="dashboard-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#152019] text-sm text-[#647067] dark:text-gray-300 hover:text-[#EF4444] dark:hover:text-[#EF4444] hover:border-[#EF4444]/40 transition-colors cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Stalls List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#22C55E] animate-spin" />
            </div>
          ) : stalls.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 p-8">
              <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="font-semibold text-[#17211B] dark:text-white text-lg mb-1">No stalls found</h3>
              <p className="text-sm text-[#647067] dark:text-gray-400 max-w-sm mx-auto mb-6">
                You haven't added any campus stalls yet. Click below to add your first stall!
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22C55E] text-white font-medium text-sm hover:bg-[#16A34A] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Your First Stall
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {stalls.map((stall) => {
                const isEditing = editingId === stall._id;
                const stallImage = getStallImage(stall);

                return (
                  <div
                    key={stall._id}
                    className={`bg-white dark:bg-[#152019] rounded-2xl border shadow-sm transition-all overflow-hidden ${
                      isEditing ? 'border-[#22C55E]/50 ring-1 ring-[#22C55E]/30' : 'border-gray-100 dark:border-neutral-800'
                    }`}
                  >
                    {/* Stall Header Row with Image Thumbnail */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800 gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={stallImage}
                          alt={stall.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-neutral-700"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-[#17211B] dark:text-white text-base sm:text-lg">{stall.name}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-[#647067] dark:text-gray-300 font-medium">
                              {stall.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#647067] dark:text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#22C55E]" /> {stall.location}
                          </p>

                          {/* Live Status Indicators */}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${stall.isOpen ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-red-50 dark:bg-red-950/40 text-red-500'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${stall.isOpen ? 'bg-[#22C55E]' : 'bg-red-400'}`} />
                              {stall.isOpen ? 'Open' : 'Closed'}
                            </span>
                            {stall.acceptsUPI && (
                              <span className="text-xs bg-[#22C55E]/10 dark:bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full font-medium">
                                UPI Active
                              </span>
                            )}
                            {stall.acceptsCash && (
                              <span className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                                Cash Accepted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          to={`/stalls/${stall._id}`}
                          className="p-2 rounded-lg text-[#647067] dark:text-gray-400 hover:text-[#22C55E] hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                          title="Preview public page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {!isEditing ? (
                          <>
                            <button
                              id={`edit-stall-${stall._id}`}
                              onClick={() => startEdit(stall)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#17211B] dark:bg-[#22C55E] text-white text-xs font-medium hover:bg-[#22C55E] dark:hover:bg-[#16A34A] transition-colors cursor-pointer shadow-xs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(stall._id, stall.name)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Delete stall"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-neutral-700 text-xs font-medium text-[#647067] dark:text-gray-300 hover:border-gray-300 dark:hover:border-neutral-600 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              id={`save-stall-${stall._id}`}
                              onClick={() => handleSave(stall._id)}
                              disabled={saving}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#22C55E] text-white text-xs font-medium hover:bg-[#16A34A] transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                            >
                              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                      <div className="p-5 space-y-4 bg-gray-50/50 dark:bg-[#101813]/60">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div>
                            <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Stall Name *</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors ${errors.name ? 'border-[#EF4444]' : 'border-gray-200 dark:border-neutral-700'}`}
                            />
                            {errors.name && <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>}
                          </div>

                          {/* Category */}
                          <div>
                            <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Category</label>
                            <select
                              value={editForm.category}
                              onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                              className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#22C55E] bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white"
                            >
                              <option value="Food & Beverages">Food & Beverages</option>
                              <option value="Beverages">Beverages</option>
                              <option value="Stationery & Supplies">Stationery & Supplies</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          {/* Location */}
                          <div>
                            <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Location *</label>
                            <input
                              type="text"
                              value={editForm.location}
                              onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                              className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors ${errors.location ? 'border-[#EF4444]' : 'border-gray-200 dark:border-neutral-700'}`}
                            />
                            {errors.location && <p className="text-xs text-[#EF4444] mt-1">{errors.location}</p>}
                          </div>

                          {/* Timing */}
                          <div>
                            <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Opening Hours</label>
                            <input
                              type="text"
                              value={editForm.timing}
                              onChange={(e) => setEditForm((f) => ({ ...f, timing: e.target.value }))}
                              placeholder="e.g. 8:00 AM – 6:00 PM"
                              className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Photo URL */}
                        <div>
                          <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Photo URL</label>
                          <input
                            type="url"
                            value={editForm.imageUrl}
                            onChange={(e) => setEditForm((f) => ({ ...f, imageUrl: e.target.value }))}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Description</label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                            rows={2}
                            className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] resize-none transition-colors"
                            placeholder="Brief description of your stall..."
                          />
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { field: 'isOpen', label: 'Currently Open', icon: Clock },
                            { field: 'acceptsUPI', label: 'UPI Accepted', icon: Smartphone },
                            { field: 'acceptsCash', label: 'Cash Accepted', icon: Banknote },
                          ].map(({ field, label, icon: Icon }) => (
                            <button
                              key={field}
                              type="button"
                              onClick={() => toggleEditField(field)}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                                editForm[field]
                                  ? 'border-[#22C55E]/30 dark:border-[#22C55E]/40 bg-[#22C55E]/5 dark:bg-[#22C55E]/10'
                                  : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#0e1612]'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editForm[field] ? 'bg-[#22C55E]/15' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                                <Icon className={`w-4 h-4 ${editForm[field] ? 'text-[#22C55E]' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-[#17211B] dark:text-white">{label}</div>
                                <div className={`text-xs ${editForm[field] ? 'text-[#22C55E]' : 'text-gray-400'}`}>
                                  {editForm[field] ? 'Enabled' : 'Disabled'}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Backup instructions */}
                        <div>
                          <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">Backup Payment Instructions</label>
                          <textarea
                            value={editForm.backupPaymentInstructions}
                            onChange={(e) => setEditForm((f) => ({ ...f, backupPaymentInstructions: e.target.value }))}
                            rows={2}
                            className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] resize-none transition-colors"
                            placeholder="e.g. Cash accepted if UPI is unavailable. Exact change appreciated."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── ADD NEW STALL MODAL ────────────────────────────────────────────── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
          style={{ backgroundColor: 'rgba(10, 16, 12, 0.75)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
        >
          <div className="bg-white dark:bg-[#152019] rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800 sticky top-0 bg-white/95 dark:bg-[#152019]/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-[#17211B] dark:text-white text-base">Add New Campus Stall</h2>
                  <p className="text-xs text-[#647067] dark:text-gray-400">List your stall on CampusPay</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg text-[#647067] dark:text-gray-400 hover:text-[#17211B] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateStallSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stall Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                    Stall Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="e.g. Juice Junction"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors ${addErrors.name ? 'border-[#EF4444]' : 'border-gray-200 dark:border-neutral-700'}`}
                  />
                  {addErrors.name && <p className="text-xs text-[#EF4444] mt-1">{addErrors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                    Category
                  </label>
                  <select
                    value={addForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setAddForm({
                        ...addForm,
                        category: newCat,
                        imageUrl: addForm.imageUrl || DEFAULT_STALL_IMAGES[newCat] || '',
                      });
                    }}
                    className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#22C55E] bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white"
                  >
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Stationery & Supplies">Stationery & Supplies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                    Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.location}
                    onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                    placeholder="e.g. Block B, Ground Floor"
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors ${addErrors.location ? 'border-[#EF4444]' : 'border-gray-200 dark:border-neutral-700'}`}
                  />
                  {addErrors.location && <p className="text-xs text-[#EF4444] mt-1">{addErrors.location}</p>}
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={addForm.timing}
                    onChange={(e) => setAddForm({ ...addForm, timing: e.target.value })}
                    placeholder="e.g. 8:00 AM – 7:00 PM"
                    className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                  />
                </div>
              </div>

              {/* Photo Preset & Custom Photo URL */}
              <div>
                <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                  Stall Photo
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {PRESET_PHOTOS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setAddForm({ ...addForm, imageUrl: p.url })}
                      className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        addForm.imageUrl === p.url
                          ? 'bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E] font-semibold'
                          : 'border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-[#647067] dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={addForm.imageUrl}
                  onChange={(e) => setAddForm({ ...addForm, imageUrl: e.target.value })}
                  placeholder="Or paste an image URL (https://images.unsplash.com/...)"
                  className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                  Description
                </label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  rows={2}
                  placeholder="Tell students about your menu, snacks, or services..."
                  className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] resize-none transition-colors"
                />
              </div>

              {/* Toggles */}
              <div>
                <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-2">
                  Payment & Operating Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { field: 'isOpen', label: 'Currently Open', icon: Clock },
                    { field: 'acceptsUPI', label: 'UPI Accepted', icon: Smartphone },
                    { field: 'acceptsCash', label: 'Cash Accepted', icon: Banknote },
                  ].map(({ field, label, icon: Icon }) => (
                    <button
                      key={field}
                      type="button"
                      onClick={() => toggleAddField(field)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${
                        addForm[field]
                          ? 'border-[#22C55E]/40 bg-[#22C55E]/5 dark:bg-[#22C55E]/10'
                          : 'border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/40'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${addForm[field] ? 'bg-[#22C55E]/15 text-[#22C55E]' : 'bg-gray-100 dark:bg-neutral-800 text-gray-400'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#17211B] dark:text-white">{label}</div>
                        <div className={`text-[11px] ${addForm[field] ? 'text-[#22C55E] font-medium' : 'text-gray-400'}`}>
                          {addForm[field] ? 'Active' : 'Off'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Backup Instructions */}
              <div>
                <label className="block text-xs font-semibold text-[#17211B] dark:text-gray-200 mb-1.5">
                  Backup Payment Instructions
                </label>
                <input
                  type="text"
                  value={addForm.backupPaymentInstructions}
                  onChange={(e) => setAddForm({ ...addForm, backupPaymentInstructions: e.target.value })}
                  placeholder="e.g. Cash accepted if UPI network drops."
                  className="w-full border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-[#0e1612] text-[#17211B] dark:text-white focus:outline-none focus:border-[#22C55E] transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 text-sm font-medium text-[#647067] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#22C55E] text-white text-sm font-semibold hover:bg-[#16A34A] transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Stall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}
