const router = require('express').Router();
var admin = require("firebase-admin");
const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const { checkAuth } = require('../middlewares/checkAuth');
const Address = require('../models/Address');
const { createPaymentIntent, createCheckoutSession } = require('../helpers/stripe');
const Product = require('../models/Product');
const Payment = require('../models/Payment');
const Order = require('../models/Orders');
const OrderItem = require('../models/OrderItem');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const calculateOrderAmount = async (items) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    total += product.price * item.quantity;
  }
  return total * 100; // Convert to cents
};

router.post('/login',async (req, res) => {
        try {
        const access_token = req.body.access_token;
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        const uid = decodedToken.uid;
        console.log(decodedToken);
        const customer = await Customer.findOne(
            { email: decodedToken.email }
        );
        
        if (!customer) {
            return res.status(404).json({ error: 'User not found' });
        }
    
        const token = jwt.sign({ uid, email: decodedToken.email }, JWT_SECRET, { expiresIn: '365d' });
        res.status(200).json({ message: 'Login successful', uid, email: decodedToken.email, token });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/register', async (req, res) => {
           try {
        const access_token = req.body.access_token;
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        const uid = decodedToken.uid;
        console.log(decodedToken);
        const existingCustomer = await Customer.findOne({ email: decodedToken.email });
        if (existingCustomer) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const newCustomer = new Customer({
            email: decodedToken.email,
            firstName: decodedToken.name || 'GoogleUser',
            firebaseUid: uid
        });
        await newCustomer.save();
        const token = jwt.sign({ uid, email: decodedToken.email }, JWT_SECRET, { expiresIn: '365d' });
        res.status(200).json({ message: 'Registration successful', uid, email: decodedToken.email, token });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
})

router.post('/google-login', async (req, res) => {
    try {
        const access_token = req.body.access_token;
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        const uid = decodedToken.uid;

        await Customer.findOneAndUpdate(
            { email: decodedToken.email },
            { email: decodedToken.email, firstName: decodedToken.name || 'GoogleUser' },
            { upsert: true, new: true }
        );

        const token = jwt.sign({ uid, email: decodedToken.email }, JWT_SECRET, { expiresIn: '365d' });
        res.status(200).json({ message: 'Login successful', uid, email: decodedToken.email, token });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.get('/protected', checkAuth, async (req, res) => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user });
});


// Create a new address
router.post('/address', checkAuth, async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const userId = customer._id;
    const address = new Address({ ...req.body, customer: userId });
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all addresses
router.get('/address', checkAuth, async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const userId = customer._id;
    const addresses = await Address.find({ customer: userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific address by ID
router.get('/address/:id', checkAuth, async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const userId = customer._id;
    const address = await Address.findOne({ _id: req.params.id, customer: userId });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an address by ID
router.put('/address/:id', checkAuth, async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const userId = customer._id;
    const address = await Address.findOneAndUpdate({ _id: req.params.id, customer: userId }, req.body, { new: true });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an address by ID
router.delete('/address/:id', checkAuth, async (req, res) => {
  try {
    let customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    const userId = customer._id;
    const address = await Address.findOneAndDelete({ _id: req.params.id, customer: userId });
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for the authenticated user with pagination and date filters
router.get('/orders', checkAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    const customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    let query = { user: customer._id };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('items')
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
        hasNext: parseInt(page) * parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/checkout', checkAuth, async (req, res) => {
    try {
        const { items } = req.body;
        const successUrl =  'http://localhost:5173/success';
        const cancelUrl = 'http://localhost:5173/cancel';
        const customer = await Customer.findOne({ email: req.user.email });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        // Calculate total amount and create order items
        let totalAmount = 0;
        const orderItems = [];
        const lineItems = [];
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) throw new Error(`Product ${item.productId} not found`);
            const orderItem = new OrderItem({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
            await orderItem.save();
            orderItems.push(orderItem._id);
            totalAmount += product.price * item.quantity;
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        description: product.description,
                        images: product.image ? [product.image] : []
                    },
                    unit_amount: Math.round(product.price * 100) // Ensure integer
                },
                quantity: item.quantity
            });
        }

        // Create a payment record with status pending
        const payment = new Payment({
            customer: customer._id,
            amount: totalAmount,
            method: 'stripe',
            status: 'pending',
            provider: 'stripe'
        });
        await payment.save();

        // Create order
        const order = new Order({
            user: customer._id,
            items: orderItems,
            payment: payment._id,
            itemsTotal: totalAmount,
            grandTotal: totalAmount
        });
        await order.save();

        // Create a checkout session
        const session = await createCheckoutSession(lineItems, successUrl, cancelUrl, { customer: customer._id.toString(), paymentId: payment._id.toString(), orderId: order._id.toString() });
        console.log(session);

        // Update payment with transactionId and gatewayResponse
        payment.transactionId = session.id;
        payment.gatewayResponse = session;
        await payment.save();

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;