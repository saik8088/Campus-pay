// Demo stall data - clearly labelled as sample data for demonstration purposes

export const DEFAULT_STALL_IMAGES = {
  'Main Canteen': 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80',
  'Juice Corner': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80',
  'Campus Stationery': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
  'Tech Café': 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
  'Food & Beverages': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
  'Stationery & Supplies': 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80',
};

export function getStallImage(stall) {
  if (!stall) return DEFAULT_STALL_IMAGES['Food & Beverages'];
  if (stall.imageUrl) return stall.imageUrl;
  if (DEFAULT_STALL_IMAGES[stall.name]) return DEFAULT_STALL_IMAGES[stall.name];
  if (DEFAULT_STALL_IMAGES[stall.category]) return DEFAULT_STALL_IMAGES[stall.category];
  return DEFAULT_STALL_IMAGES['Food & Beverages'];
}

export const DEMO_STALLS = [
  {
    _id: "demo-001",
    name: "Main Canteen",
    category: "Food & Beverages",
    location: "Block A, Ground Floor",
    description: "The central campus canteen serving breakfast, lunch, and snacks. Offers a wide variety of meals for students and staff.",
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: true,
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80",
    qrImageUrl: null,
    backupPaymentInstructions: "If UPI is unavailable, cash is accepted. Exact change appreciated.",
    ownerId: "demo-owner-001",
    tags: ["breakfast", "lunch", "snacks", "meals"],
    timing: "7:00 AM – 8:00 PM",
    phone: null
  },
  {
    _id: "demo-002",
    name: "Juice Corner",
    category: "Beverages",
    location: "Block C, Near Library",
    description: "Fresh fruit juices, smoothies, and cold beverages. Perfect for a quick refresh between classes.",
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: false,
    imageUrl: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80",
    qrImageUrl: null,
    backupPaymentInstructions: "This stall accepts UPI only. Please ensure you have a UPI app ready before ordering.",
    ownerId: "demo-owner-002",
    tags: ["juice", "smoothies", "beverages", "cold drinks"],
    timing: "9:00 AM – 6:00 PM",
    phone: null
  },
  {
    _id: "demo-003",
    name: "Campus Stationery",
    category: "Stationery & Supplies",
    location: "Admin Block, Ground Floor",
    description: "Notebooks, pens, printing services, and essential stationery items for all students.",
    isOpen: false,
    acceptsUPI: true,
    acceptsCash: true,
    imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    qrImageUrl: null,
    backupPaymentInstructions: "Cash or UPI both accepted. For printing services, pay after the job is complete.",
    ownerId: "demo-owner-003",
    tags: ["notebooks", "pens", "printing", "stationery", "supplies"],
    timing: "8:00 AM – 5:00 PM",
    phone: null
  },
  {
    _id: "demo-004",
    name: "Tech Café",
    category: "Food & Beverages",
    location: "Engineering Block, 2nd Floor",
    description: "Coffee, sandwiches, and quick bites for engineering students. A favourite study-break spot.",
    isOpen: true,
    acceptsUPI: true,
    acceptsCash: true,
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    qrImageUrl: null,
    backupPaymentInstructions: "Both cash and UPI accepted. Cash preferred during peak hours.",
    ownerId: "demo-owner-004",
    tags: ["coffee", "sandwiches", "snacks", "beverages"],
    timing: "8:30 AM – 7:30 PM",
    phone: null
  }
];

export const CATEGORIES = [
  "All",
  "Food & Beverages",
  "Beverages",
  "Stationery & Supplies",
];

export const PAYMENT_METHODS = ["All", "UPI Available", "Cash Accepted", "Currently Open"];
