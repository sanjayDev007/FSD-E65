const Vendor = require("../models/Vendor");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_vendor_secret_key';

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const vendor = await Vendor.findOne({ email: email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken.sign({ id: vendor._id, role: 'vendor' }, JWT_SECRET, { expiresIn: '365d' });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAllVendors = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (isNaN(limit) || limit < 1) limit = 10;

        // whitelist sortable fields
        const allowedSort = ['createdAt', 'name', 'email', 'phone'];
        if (!allowedSort.includes(sortBy)) sortBy = 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;
        const sort = { [sortBy]: sortOrder };

        // build search filter (case-insensitive, escapes special regex chars)
        const filter = {};
        if (typeof search === 'string' && search.trim().length > 0) {
            const q = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(q, 'i');
            filter.$or = [
                { name: regex },
                { email: regex },
                { address: regex },
                { phone: regex }
            ];
        }

        const total = await Vendor.countDocuments(filter);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const skip = (page - 1) * limit;

        // use lean() for performance and to allow deleting password easily
        const vendors = await Vendor.find(filter).sort(sort).skip(skip).limit(limit).lean();

        // remove passwords from results
        vendors.forEach(v => { if (v && v.password) delete v.password; });

        res.status(200).json({
            vendors,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getVendorById = async (req, res) => {
    try {
        let id = null;
        if (req.role === "admin") {
            id = req.params.id;
        } else if (req.role === "vendor") {
            id = req.user.id;
        }
        if (!id) return res.status(400).json({ message: 'Vendor id is required in params' });
        const vendor = await Vendor.findById(id).lean();
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        if (vendor.password) delete vendor.password; // don't return password
        res.status(200).json({ vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.createVendor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const vendor = await Vendor.findOne({ email: email });

        if (vendor) {
            return res.status(400).json({ message: 'Vendor already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({ email: email, password: hashedPassword });
        await newVendor.save();
        res.status(201).json({ message: 'Vendor created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports.updateVendor = async (req, res) => {
    try {
        let id = null;
        if (req.role === "admin") {
            id = req.params.id;
        } else if (req.role === "vendor") {
            id = req.user.id;
        }
        if (!id) return res.status(400).json({ message: 'Vendor id is required in params' });

        const vendor = await Vendor.findById(id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        const { name, address, phone, email, password, createdAt } = req.body;

        // If email is being changed, ensure uniqueness
        if (email && email !== vendor.email) {
            const existing = await Vendor.findOne({ email });
            if (existing && existing._id.toString() !== id) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            vendor.email = email;
        }

        if (name !== undefined) vendor.name = name;
        if (address !== undefined) vendor.address = address;
        if (phone !== undefined) vendor.phone = phone;

        // Update createdAt if provided and valid
        if (createdAt !== undefined) {
            const d = new Date(createdAt);
            if (!isNaN(d)) vendor.createdAt = d;
        }

        // Hash password if provided
        if (password) {
            vendor.password = await bcrypt.hash(password, 10);
        }

        await vendor.save();

        const result = vendor.toObject();
        delete result.password; // don't return password

        res.status(200).json({ message: 'Vendor updated successfully', vendor: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.deleteVendor = async (req, res) => {
    try {
        let id = null;
        if (req.role === "admin") {
            id = req.params.id;
        } else if (req.role === "vendor") {
            id = req.user.id;
        }
        if (!id) return res.status(400).json({ message: 'Vendor id is required in params' });
        const vendor = await Vendor.findById(id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        await Vendor.findByIdAndDelete(id);
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}