const express = require('express');
const { body, validationResult } = require('express-validator');
const { findProductById, updateProduct } = require('../utils/storage');
const { auth } = require('../middleware/auth');

const router = express.Router();

// In-memory cart storage (in production, you'd use a database)
// Structure: { userId: { items: [{ productId, quantity, name, price }], total: number } }
const carts = {};

// Helper function to calculate cart total
const calculateCartTotal = (cartItems) => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const userCart = carts[userId] || { items: [], total: 0 };
    
    res.json({
      message: 'Cart retrieved successfully',
      cart: userCart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', [
  auth,
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Find the product
    const product = findProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if enough stock is available
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${product.stock} items available` 
      });
    }

    // Initialize user cart if it doesn't exist
    if (!carts[userId]) {
      carts[userId] = { items: [], total: 0 };
    }

    // Check if item already exists in cart
    const existingItemIndex = carts[userId].items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const newQuantity = carts[userId].items[existingItemIndex].quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          message: `Cannot add ${quantity} more items. Maximum available: ${product.stock - carts[userId].items[existingItemIndex].quantity}` 
        });
      }
      
      carts[userId].items[existingItemIndex].quantity = newQuantity;
    } else {
      // New item, add to cart
      carts[userId].items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }

    // Recalculate total
    carts[userId].total = calculateCartTotal(carts[userId].items);

    res.json({
      message: 'Item added to cart successfully',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// @route   PUT /api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.put('/update', [
  auth,
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Check if user has a cart
    if (!carts[userId] || carts[userId].items.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Find the product
    const product = findProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find item in cart
    const itemIndex = carts[userId].items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item from cart
      carts[userId].items.splice(itemIndex, 1);
    } else {
      // Check stock availability
      if (quantity > product.stock) {
        return res.status(400).json({ 
          message: `Insufficient stock. Only ${product.stock} items available` 
        });
      }
      
      // Update quantity
      carts[userId].items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    carts[userId].total = calculateCartTotal(carts[userId].items);

    res.json({
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Check if user has a cart
    if (!carts[userId] || carts[userId].items.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Find and remove item from cart
    const itemIndex = carts[userId].items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    carts[userId].items.splice(itemIndex, 1);

    // Recalculate total
    carts[userId].total = calculateCartTotal(carts[userId].items);

    res.json({
      message: 'Item removed from cart successfully',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, (req, res) => {
  try {
    const userId = req.user.id;
    
    // Clear user's cart
    carts[userId] = { items: [], total: 0 };

    res.json({
      message: 'Cart cleared successfully',
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

// @route   POST /api/cart/checkout
// @desc    Checkout cart (simulate purchase)
// @access  Private
router.post('/checkout', auth, (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has a cart
    if (!carts[userId] || carts[userId].items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Verify stock availability for all items
    for (const cartItem of carts[userId].items) {
      const product = findProductById(cartItem.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${cartItem.name} not found` });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${cartItem.name}. Only ${product.stock} available` 
        });
      }
    }

    // Update product stock (simulate purchase)
    const purchasedItems = [...carts[userId].items];
    const totalAmount = carts[userId].total;

    for (const cartItem of purchasedItems) {
      const product = findProductById(cartItem.productId);
      const newStock = product.stock - cartItem.quantity;
      updateProduct(cartItem.productId, { stock: newStock });
    }

    // Clear the cart after successful checkout
    carts[userId] = { items: [], total: 0 };

    res.json({
      message: 'Checkout successful',
      purchasedItems,
      totalAmount,
      cart: carts[userId]
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during checkout' });
  }
});

module.exports = router;