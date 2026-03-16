const express = require("express");
const router = express.Router();
const products = require("../data/products");

// In-memory cart (array of { productId, quantity })
let cart = [];

// GET /api/cart — current cart with product details and totals
router.get("/", (_req, res) => {
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
      subtotal: product ? +(product.price * item.quantity).toFixed(2) : 0
    };
  }).filter((item) => item.product);

  const total = +items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  res.json({ success: true, items, total, count });
});

// POST /api/cart — add item { productId, quantity }
router.post("/", (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "productId is required" });
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  if (!product.inStock) {
    return res.status(400).json({ success: false, message: "Product is out of stock" });
  }

  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.status(201).json({ success: true, message: "Added to cart", cart });
});

// PUT /api/cart/:productId — update quantity
router.put("/:productId", (req, res) => {
  const { quantity } = req.body;
  const item = cart.find((i) => i.productId === req.params.productId);

  if (!item) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }

  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== req.params.productId);
    return res.json({ success: true, message: "Removed from cart" });
  }

  item.quantity = quantity;
  res.json({ success: true, message: "Cart updated", item });
});

// DELETE /api/cart/:productId — remove single item
router.delete("/:productId", (req, res) => {
  const idx = cart.findIndex((i) => i.productId === req.params.productId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }
  cart.splice(idx, 1);
  res.json({ success: true, message: "Removed from cart" });
});

// DELETE /api/cart — clear entire cart
router.delete("/", (_req, res) => {
  cart = [];
  res.json({ success: true, message: "Cart cleared" });
});

// Export cart reference for orders
router.getCart = () => cart;
router.clearCart = () => { cart = []; };

module.exports = router;
