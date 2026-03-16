const express = require("express");
const router = express.Router();
const products = require("../data/products");

// GET /api/products — list all, optionally filter by category or search
router.get("/", (req, res) => {
  let result = [...products];
  const { category, search } = req.query;

  if (category && category !== "all") {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, products: result });
});

// GET /api/products/categories — distinct categories
router.get("/categories", (_req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];
  res.json({ success: true, categories });
});

// GET /api/products/:id — single product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.json({ success: true, product });
});

module.exports = router;
