const mongoose = require('mongoose');

const StallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Stall name is required'],
      trim: true,
      maxlength: [100, 'Name must be under 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Food & Beverages', 'Beverages', 'Stationery & Supplies', 'Other'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description must be under 500 characters'],
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    acceptsUPI: {
      type: Boolean,
      default: false,
    },
    acceptsCash: {
      type: Boolean,
      default: false,
    },
    qrImageUrl: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    backupPaymentInstructions: {
      type: String,
      default: '',
      maxlength: [500, 'Backup instructions must be under 500 characters'],
    },
    timing: {
      type: String,
      default: '',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stall', StallSchema);
