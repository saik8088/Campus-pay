const mongoose = require('mongoose');
const Stall = require('../models/Stall');
const { validationResult } = require('express-validator');
const demoStalls = require('../data/demoStalls');

// GET /api/stalls — Public
exports.getStalls = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.set('X-CampusPay-Data-Source', 'demo');
      return res.json(demoStalls);
    }
    const stalls = await Stall.find().select('-ownerId').sort({ name: 1 });
    res.set('X-CampusPay-Data-Source', 'database');
    return res.json(stalls);
  } catch (err) {
    console.error('[STALLS] getStalls error, serving fallback:', err.message);
    res.set('X-CampusPay-Data-Source', 'demo');
    return res.json(demoStalls);
  }
};

// GET /api/stalls/:id — Public
exports.getStall = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const demo = demoStalls.find((s) => s._id === req.params.id);
      if (demo) return res.json(demo);
      return res.status(404).json({ message: 'Stall not found in demo mode.' });
    }
    const stall = await Stall.findById(req.params.id).select('-ownerId');
    if (!stall) return res.status(404).json({ message: 'Stall not found.' });
    return res.json(stall);
  } catch (err) {
    if (err.name === 'CastError') {
      const demo = demoStalls.find((s) => s._id === req.params.id);
      if (demo) return res.json(demo);
      return res.status(400).json({ message: 'Invalid stall ID.' });
    }
    console.error('[STALLS] getStall error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// GET /api/owner/stalls — Owner only (own stalls)
exports.getOwnerStalls = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(demoStalls.slice(0, 2));
    }
    const stalls = await Stall.find({ ownerId: req.user.id }).sort({ name: 1 });
    return res.json(stalls);
  } catch (err) {
    console.error('[STALLS] getOwnerStalls error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// PUT /api/owner/stalls/:id — Owner only, authorization enforced
exports.updateStall = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found.' });

    // Authorization: only the owner of the stall can edit it
    if (stall.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden. You are not the owner of this stall.' });
    }

    const allowedFields = [
      'name', 'category', 'location', 'description', 'timing',
      'isOpen', 'acceptsUPI', 'acceptsCash', 'backupPaymentInstructions', 'tags',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        stall[field] = req.body[field];
      }
    });

    await stall.save();
    return res.json(stall);
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid stall ID.' });
    console.error('[STALLS] updateStall error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

// POST /api/owner/stalls — Owner create stall
exports.createStall = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }
  const {
    name, category, location, description, timing,
    isOpen, acceptsUPI, acceptsCash, backupPaymentInstructions, imageUrl,
  } = req.body;

  if (mongoose.connection.readyState !== 1) {
    const newStall = {
      _id: `stall-${Date.now()}`,
      name,
      category: category || 'Food & Beverages',
      location,
      description: description || '',
      timing: timing || '',
      isOpen: isOpen ?? true,
      acceptsUPI: acceptsUPI ?? true,
      acceptsCash: acceptsCash ?? true,
      backupPaymentInstructions: backupPaymentInstructions || '',
      imageUrl: imageUrl || null,
      ownerId: req.user ? req.user.id : 'demo-owner',
    };
    return res.status(201).json(newStall);
  }

  try {
    const stall = await Stall.create({
      name,
      category: category || 'Food & Beverages',
      location,
      description: description || '',
      timing: timing || '',
      isOpen: isOpen ?? true,
      acceptsUPI: acceptsUPI ?? true,
      acceptsCash: acceptsCash ?? true,
      backupPaymentInstructions: backupPaymentInstructions || '',
      imageUrl: imageUrl || null,
      ownerId: req.user.id,
    });
    return res.status(201).json(stall);
  } catch (err) {
    console.error('[STALLS] createStall error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/owner/stalls/:id — Owner delete stall
exports.deleteStall = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ message: 'Stall deleted successfully' });
  }
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found.' });
    if (stall.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    await stall.deleteOne();
    return res.json({ message: 'Stall deleted successfully' });
  } catch (err) {
    console.error('[STALLS] deleteStall error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/owner/stalls/:id/qr — Owner only, QR image update
exports.updateQR = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found.' });
    if (stall.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Store relative URL (file is saved by multer to /uploads/)
    stall.qrImageUrl = `/uploads/${req.file.filename}`;
    await stall.save();
    return res.json({ qrImageUrl: stall.qrImageUrl });
  } catch (err) {
    console.error('[STALLS] updateQR error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};
