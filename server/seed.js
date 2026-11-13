/**
 * CampusPay Database Seeder
 * Populates MongoDB with sample stall owners and demo campus stalls.
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Stall = require('./models/Stall');

const SEED_USERS = [
  {
    name: 'Canteen Manager',
    email: 'canteen@campus.edu',
    password: 'password123',
    role: 'owner',
  },
  {
    name: 'Juice Bar Operator',
    email: 'juice@campus.edu',
    password: 'password123',
    role: 'owner',
  },
  {
    name: 'Stationery Incharge',
    email: 'stationery@campus.edu',
    password: 'password123',
    role: 'owner',
  },
];

const SEED_STALLS = [
  {
    name: 'Main Canteen',
    category: 'Food & Beverages',
    location: 'Block A, Ground Floor',
    description: 'The central campus canteen serving breakfast, lunch, and snacks. Offers a wide variety of meals for students and staff.',
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: true,
    qrImageUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80',
    backupPaymentInstructions: 'If UPI is unavailable, cash is accepted. Exact change appreciated.',
    timing: '7:00 AM – 8:00 PM',
    tags: ['breakfast', 'lunch', 'snacks', 'meals'],
  },
  {
    name: 'Juice Corner',
    category: 'Beverages',
    location: 'Block C, Near Library',
    description: 'Fresh fruit juices, smoothies, and cold beverages. Perfect for a quick refresh between classes.',
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: false,
    qrImageUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80',
    backupPaymentInstructions: 'This stall accepts UPI only. Please ensure you have a UPI app ready before ordering.',
    timing: '9:00 AM – 6:00 PM',
    tags: ['juice', 'smoothies', 'beverages', 'cold drinks'],
  },
  {
    name: 'Campus Stationery',
    category: 'Stationery & Supplies',
    location: 'Admin Block, Ground Floor',
    description: 'Notebooks, pens, printing services, and essential stationery items for all students.',
    isOpen: false,
    acceptsUPI: true,
    acceptsCash: true,
    qrImageUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
    backupPaymentInstructions: 'Cash or UPI both accepted. For printing services, pay after the job is complete.',
    timing: '8:00 AM – 5:00 PM',
    tags: ['notebooks', 'pens', 'printing', 'stationery', 'supplies'],
  },
  {
    name: 'Tech Café',
    category: 'Food & Beverages',
    location: 'Engineering Block, 2nd Floor',
    description: 'Coffee, sandwiches, and quick bites for engineering students. A favourite study-break spot.',
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: true,
    qrImageUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    backupPaymentInstructions: 'UPI preferred. Cash accepted for exact bill amounts under ₹100.',
    timing: '9:30 AM – 7:30 PM',
    tags: ['coffee', 'sandwiches', 'tea', 'study'],
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[SEED] MONGODB_URI is not set in .env. Cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('[SEED] Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany({});
    await Stall.deleteMany({});
    console.log('[SEED] Cleared existing Users and Stalls.');

    // Create users
    const createdUsers = [];
    for (const u of SEED_USERS) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[SEED] Created ${createdUsers.length} stall owner accounts:`);
    SEED_USERS.forEach((u) => console.log(`   - Email: ${u.email} | Password: ${u.password}`));

    // Create stalls assigned to owners
    for (let i = 0; i < SEED_STALLS.length; i++) {
      const stallData = SEED_STALLS[i];
      const owner = createdUsers[i % createdUsers.length];
      await Stall.create({
        ...stallData,
        ownerId: owner._id,
      });
    }
    console.log(`[SEED] Created ${SEED_STALLS.length} sample campus stalls.`);
    console.log('[SEED] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[SEED ERROR]', err);
    process.exit(1);
  }
};

seed();
