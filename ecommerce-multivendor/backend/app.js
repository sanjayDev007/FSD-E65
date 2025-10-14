require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
var admin = require("firebase-admin");
var serviceAccount = require("./service-account.json");
const Stripe = require('stripe');
const Payment = require('./models/Payment');
const Order = require('./models/Orders');
// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use express.raw ONLY for this route
app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // req.body is already a Buffer when using express.raw()
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err.message);
      return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`✅ PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`✅ Checkout session completed for ${session.amount_total}`);
        // Update payment status to paid
        try {
          const payment = await Payment.findOne({ transactionId: session.id });
          if (payment) {
            payment.status = 'paid';
            payment.paidAt = new Date();
            payment.amount = session.amount_total / 100; // Convert cents to dollars
            await payment.save();
            console.log(`Payment ${payment._id} updated to paid`);

            // Update order status to confirmed
            const order = await Order.findOne({ payment: payment._id });
            if (order) {
              order.status = 'confirmed';
              await order.save();
              console.log(`Order ${order._id} updated to confirmed`);
            }
          }
        } catch (error) {
          console.error('Error updating payment and order:', error);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/vendors', require('./routes/vendorRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/admins', require('./routes/adminRoute'));
app.use('/api/customers', require('./routes/customerRoute'));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
