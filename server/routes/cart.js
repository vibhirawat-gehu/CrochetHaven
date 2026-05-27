const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// In-memory cart per user stored in DB via session or just use client-side
// This endpoint validates products and returns enriched cart data
// POST /api/cart/validate - validate cart items against current DB prices
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    if (!items || !items.length) return res.json({ items: [], total: 0 });

    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const validated = items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (!product) return null;
      return {
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        stock: product.stock
      };
    }).filter(Boolean);

    const total = validated.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ items: validated, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
