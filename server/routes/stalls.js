const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/auth');
const {
  getStalls, getStall, getOwnerStalls, updateStall, updateQR
} = require('../controllers/stallController');

const router = express.Router();

// Configure multer for QR uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `qr-${req.params.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// Public routes
router.get('/', getStalls);
router.get('/:id', getStall);

// Owner-protected routes (under /api/owner/stalls)
router.get('/owner/list', authenticate, getOwnerStalls);

router.put(
  '/owner/:id',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Stall name cannot be empty'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
    body('isOpen').optional().isBoolean(),
    body('acceptsUPI').optional().isBoolean(),
    body('acceptsCash').optional().isBoolean(),
  ],
  updateStall
);

router.put('/owner/:id/qr', authenticate, upload.single('qrImage'), updateQR);

module.exports = router;
