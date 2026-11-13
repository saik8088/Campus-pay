const express = require('express');
const authenticate = require('../middleware/auth');
const { getOwnerStalls, updateStall, updateQR, createStall, deleteStall } = require('../controllers/stallController');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// All owner routes require authentication
router.use(authenticate);

// Multer for QR images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `qr-${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Images only'));
    cb(null, true);
  },
});

// GET /api/owner/stalls
router.get('/stalls', getOwnerStalls);

// POST /api/owner/stalls
router.post(
  '/stalls',
  [
    body('name').trim().notEmpty().withMessage('Stall name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
  ],
  createStall
);

// PUT /api/owner/stalls/:id
router.put(
  '/stalls/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty(),
    body('isOpen').optional().isBoolean(),
    body('acceptsUPI').optional().isBoolean(),
    body('acceptsCash').optional().isBoolean(),
  ],
  updateStall
);

// DELETE /api/owner/stalls/:id
router.delete('/stalls/:id', deleteStall);

// PUT /api/owner/stalls/:id/qr
router.put('/stalls/:id/qr', upload.single('qrImage'), updateQR);

module.exports = router;
