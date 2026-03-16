const products = [
  // ───── Fruits ─────
  {
    id: "f1",
    name: "Royal Gala Apples",
    category: "fruits",
    price: 3.49,
    unit: "kg",
    image: "🍎",
    description: "Crisp and sweet premium apples, perfect for snacking or baking.",
    inStock: true,
    rating: 4.8
  },
  {
    id: "f2",
    name: "Organic Bananas",
    category: "fruits",
    price: 1.29,
    unit: "bunch",
    image: "🍌",
    description: "Naturally ripened organic bananas, rich in potassium.",
    inStock: true,
    rating: 4.6
  },
  {
    id: "f3",
    name: "Fresh Strawberries",
    category: "fruits",
    price: 4.99,
    unit: "pack",
    image: "🍓",
    description: "Hand-picked juicy strawberries, bursting with flavor.",
    inStock: true,
    rating: 4.9
  },
  {
    id: "f4",
    name: "Seedless Grapes",
    category: "fruits",
    price: 5.49,
    unit: "kg",
    image: "🍇",
    description: "Sweet and seedless green grapes, great for salads and snacking.",
    inStock: true,
    rating: 4.5
  },

  // ───── Vegetables ─────
  {
    id: "v1",
    name: "Baby Spinach",
    category: "vegetables",
    price: 2.99,
    unit: "pack",
    image: "🥬",
    description: "Tender baby spinach leaves, pre-washed and ready to eat.",
    inStock: true,
    rating: 4.7
  },
  {
    id: "v2",
    name: "Vine Tomatoes",
    category: "vegetables",
    price: 3.29,
    unit: "kg",
    image: "🍅",
    description: "Ripe vine tomatoes with rich, full-bodied flavor.",
    inStock: true,
    rating: 4.6
  },
  {
    id: "v3",
    name: "Sweet Bell Peppers",
    category: "vegetables",
    price: 4.49,
    unit: "pack",
    image: "🫑",
    description: "Trio of colorful bell peppers — red, yellow, and green.",
    inStock: true,
    rating: 4.4
  },
  {
    id: "v4",
    name: "Fresh Broccoli",
    category: "vegetables",
    price: 2.79,
    unit: "piece",
    image: "🥦",
    description: "Farm-fresh broccoli crowns, packed with nutrients.",
    inStock: false,
    rating: 4.3
  },

  // ───── Dairy ─────
  {
    id: "d1",
    name: "Whole Milk",
    category: "dairy",
    price: 3.99,
    unit: "liter",
    image: "🥛",
    description: "Farm-fresh whole milk, pasteurized for safety.",
    inStock: true,
    rating: 4.8
  },
  {
    id: "d2",
    name: "Greek Yogurt",
    category: "dairy",
    price: 5.49,
    unit: "pack",
    image: "🫙",
    description: "Thick and creamy Greek yogurt, high in protein.",
    inStock: true,
    rating: 4.7
  },
  {
    id: "d3",
    name: "Cheddar Cheese",
    category: "dairy",
    price: 6.99,
    unit: "pack",
    image: "🧀",
    description: "Aged sharp cheddar, perfect for sandwiches and cooking.",
    inStock: true,
    rating: 4.9
  },

  // ───── Bakery ─────
  {
    id: "b1",
    name: "Sourdough Bread",
    category: "bakery",
    price: 4.49,
    unit: "loaf",
    image: "🍞",
    description: "Artisan sourdough bread with a perfectly crisp crust.",
    inStock: true,
    rating: 4.8
  },
  {
    id: "b2",
    name: "Butter Croissants",
    category: "bakery",
    price: 5.99,
    unit: "pack",
    image: "🥐",
    description: "Flaky, buttery croissants baked fresh daily. Pack of 4.",
    inStock: true,
    rating: 4.9
  },
  {
    id: "b3",
    name: "Blueberry Muffins",
    category: "bakery",
    price: 6.49,
    unit: "pack",
    image: "🧁",
    description: "Moist blueberry muffins made with real berries. Pack of 6.",
    inStock: true,
    rating: 4.5
  },

  // ───── Beverages ─────
  {
    id: "bv1",
    name: "Fresh Orange Juice",
    category: "beverages",
    price: 4.99,
    unit: "liter",
    image: "🍊",
    description: "100% freshly squeezed orange juice, no added sugar.",
    inStock: true,
    rating: 4.7
  },
  {
    id: "bv2",
    name: "Green Tea Collection",
    category: "beverages",
    price: 7.99,
    unit: "box",
    image: "🍵",
    description: "Premium green tea, 20 individually wrapped sachets.",
    inStock: true,
    rating: 4.6
  },
  {
    id: "bv3",
    name: "Sparkling Water",
    category: "beverages",
    price: 3.49,
    unit: "pack",
    image: "💧",
    description: "Naturally sparkling mineral water. Pack of 6 bottles.",
    inStock: true,
    rating: 4.4
  },

  // ───── Snacks ─────
  {
    id: "s1",
    name: "Mixed Nuts",
    category: "snacks",
    price: 8.99,
    unit: "pack",
    image: "🥜",
    description: "Premium roasted mixed nuts — almonds, cashews, and walnuts.",
    inStock: true,
    rating: 4.8
  },
  {
    id: "s2",
    name: "Dark Chocolate Bar",
    category: "snacks",
    price: 3.99,
    unit: "piece",
    image: "🍫",
    description: "72% cocoa dark chocolate, rich and smooth.",
    inStock: true,
    rating: 4.9
  },
  {
    id: "s3",
    name: "Organic Granola",
    category: "snacks",
    price: 6.49,
    unit: "pack",
    image: "🥣",
    description: "Crunchy organic granola with honey, oats, and dried fruits.",
    inStock: true,
    rating: 4.5
  }
];

module.exports = products;
