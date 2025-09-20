const jsonwebtoken = require('jsonwebtoken');
const Product = require('../models/Products');

module.exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newProduct = new Product({
            name,
            description,
            price,
            stock: req.body.stock || 0,
            category,
            ownerModel: req.role === 'admin' ? 'Admin' : 'Vendor',
            owner: req.user.id
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        // Query params
        const { page = 1, limit = 10, search, category } = req.query;

        // Parse and sanitize pagination params
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100); // cap at 100
        const skip = (pageNum - 1) * limitNum;

        // Build filter for search & optional category
        const filter = {};
        if (search) {
            const regex = new RegExp(search.trim(), 'i'); // case-insensitive
            filter.$or = [{ name: regex }, { description: regex }];
        }
        if (category) {
            filter.category = category;
        }

        // Execute count + find in parallel
        const [total, products] = await Promise.all([
            Product.countDocuments(filter),
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
        ]);

        const totalPages = Math.ceil(total / limitNum);

        res.json({
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getProductById = async (req, res) => {
    try {
        let whereClause = {
            _id: req.params.id
        };
        const product = await Product.findOne(whereClause);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        let whereClause = {
            _id: req.params.id
        };
        if (req.role === 'vendor') {
            whereClause.owner = req.user.id;
            whereClause.ownerModel = 'Vendor';
        }
        const product = await Product.findOne(whereClause);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const { name, description, price, stock, category } = req.body;
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (category) product.category = category;
        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        let whereClause = {
            _id: req.params.id
        };
        if (req.role === 'vendor') {
            whereClause.owner = req.user.id;
            whereClause.ownerModel = 'Vendor';
        }
        const product = await Product.findOneAndDelete(whereClause);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const products = await Product.find({ owner: vendorId, ownerModel: 'Vendor' });
        res.json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
