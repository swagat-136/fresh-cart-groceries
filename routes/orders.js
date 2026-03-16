const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const products = require("../data/products");
const cartRouter = require("./cart");

// In-memory orders
const orders = [];

// POST /api/orders — place order from current cart
router.post("/", (req, res) => {
  const cart = cartRouter.getCart();

  if (cart.length === 0) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const { customer } = req.body;
  if (!customer || !customer.name || !customer.address || !customer.phone) {
    return res.status(400).json({
      success: false,
      message: "Customer name, address, and phone are required"
    });
  }

  // Build order items with product snapshots
  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      image: product.image,
      price: product.price,
      unit: product.unit,
      quantity: item.quantity,
      subtotal: +(product.price * item.quantity).toFixed(2)
    };
  });

  const total = +items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2);

  const order = {
    id: uuidv4().split("-")[0].toUpperCase(),
    items,
    total,
    customer,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  cartRouter.clearCart();

  res.status(201).json({ success: true, message: "Order placed!", order });
});

// GET /api/orders — all orders
router.get("/", (_req, res) => {
  res.json({ success: true, count: orders.length, orders: orders.reverse() });
});

// GET /api/orders/:id — single order
router.get("/:id", (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  res.json({ success: true, order });
});

module.exports = router;
