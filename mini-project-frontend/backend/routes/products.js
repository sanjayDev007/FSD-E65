const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getProducts, addProduct, findProductById, updateProduct, deleteProduct } = require('../utils/storage');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Private (both Admin and User can view)
router.get('/', auth, (req, res) => {
  try {
    const products = getProducts();
    res.json({
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Private
router.get('/:id', auth, (req, res) => {
  try {
    const product = findProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      message: 'Product retrieved successfully',
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// @route   POST /api/products
// @desc    Add a new product (Admin only)
// @access  Private (Admin)
router.post('/', [
  adminAuth,
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
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

    const { name, price, stock, description } = req.body;

    // Create new product
    const newProduct = {
      id: uuidv4(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || '',
      createdBy: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save product
    const saved = addProduct(newProduct);
    if (!saved) {
      return res.status(500).json({ message: 'Error saving product' });
    }

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private (Admin)
router.put('/:id', [
  adminAuth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
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

    const productId = req.params.id;
    const existingProduct = findProductById(productId);
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, stock, description } = req.body;

    // Prepare update data
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (description !== undefined) updateData.description = description;

    // Update product
    const updated = updateProduct(productId, updateData);
    if (!updated) {
      return res.status(500).json({ message: 'Error updating product' });
    }

    const updatedProduct = findProductById(productId);
    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private (Admin)
router.delete('/:id', adminAuth, (req, res) => {
  try {
    const productId = req.params.id;
    const existingProduct = findProductById(productId);
    
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deleted = deleteProduct(productId);
    if (!deleted) {
      return res.status(500).json({ message: 'Error deleting product' });
    }

    res.json({
      message: 'Product deleted successfully',
      deletedProduct: existingProduct
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

module.exports = router;