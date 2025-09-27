/* eslint-disable no-console */
const mongoose = require('mongoose');
const { Types } = mongoose;

// Models
const Customer = require('../models/Customer');
const Address = require('../models/Address');
const Payment = require('../models/Payment');
const OrderItem = require('../models/OrderItem');
const Order = require('../models/Orders');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce-multivendor';
const CLEAR = process.env.CLEAR === '1'; // set CLEAR=1 to wipe collections before seeding

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr, n = 1) {
  const copy = [...arr];
  const result = [];
  while (result.length < n && copy.length) {
    result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return result;
}

async function connect() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI, { dbName: process.env.DB_NAME || undefined });
  console.log('Connected to MongoDB');
}

async function clearCollections() {
  const tasks = [Order.deleteMany({}), OrderItem.deleteMany({}), Payment.deleteMany({}), Address.deleteMany({}), Customer.deleteMany({})];
  await Promise.all(tasks);
  console.log('Cleared collections');
}

async function seedCustomers() {
  const customersData = Array.from({ length: 5 }).map((_, i) => ({
    firstName: `Test${i + 1}`,
    lastName: 'User',
    email: `test${i + 1}@example.com`,
    phone: `+1-555-000${i + 1}`,
  }));
  const customers = await Customer.insertMany(customersData);
  console.log(`Inserted ${customers.length} customers`);
  return customers;
}

async function seedAddresses(customers) {
  const addresses = [];
  for (const c of customers) {
    addresses.push(
      {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: '+1-555-1234',
        address1: '123 Main St',
        city: 'Metropolis',
        state: 'CA',
        country: 'US',
        postalCode: '90001',
      },
      {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: '+1-555-5678',
        address1: '456 Market Ave',
        city: 'Gotham',
        state: 'NY',
        country: 'US',
        postalCode: '10001',
      }
    );
  }
  const result = await Address.insertMany(addresses);
  console.log(`Inserted ${result.length} addresses`);
  // Map customer -> two addresses
  const map = new Map();
  for (let i = 0; i < customers.length; i++) {
    map.set(customers[i]._id.toString(), {
      ship: result[i * 2 + 0]._id,
      bill: result[i * 2 + 1]._id,
    });
  }
  return map;
}

async function seedPayments(count = 6) {
  const methods = ['cod', 'card', 'paypal', 'stripe'];
  const statuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];
  const payload = Array.from({ length: count }).map((_, i) => ({
    method: methods[i % methods.length],
    status: statuses[i % statuses.length],
    provider: methods[i % methods.length],
    transactionId: `TXN-${Date.now()}-${i}`,
    paidAt: statuses[i % statuses.length] === 'paid' ? new Date() : undefined,
    gatewayResponse: { ok: true, idx: i },
  }));
  const payments = await Payment.insertMany(payload);
  console.log(`Inserted ${payments.length} payments`);
  return payments;
}

async function seedOrderItems(count = 20) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const qty = randInt(1, 3);
    const unit = randInt(10, 120);
    const discount = Math.random() < 0.4 ? randInt(0, 10) : 0; // flat discount per line
    const tax = Math.round(unit * qty * 0.1); // ~10% tax per line
    items.push({
      product: new Types.ObjectId(),
      // variant optional
      // seller optional
      sku: `SKU-${i + 1}`,
      title: `Sample Item ${i + 1}`,
      quantity: qty,
      price: unit,
      discount,
      tax,
    });
  }
  const result = await OrderItem.insertMany(items);
  console.log(`Inserted ${result.length} order items`);
  return result;
}

async function seedOrders(customers, addrMap, payments, allItems) {
  const orders = [];
  for (const c of customers) {
    const addrPair = addrMap.get(c._id.toString());
    for (let k = 0; k < 2; k++) {
      const itemDocs = pick(allItems, randInt(2, 3));
      const ord = new Order({
        user: c._id, // references 'User' logically; ObjectId is fine
        items: itemDocs.map((it) => it._id),
        status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'][randInt(0, 4)],
        currency: 'USD',
        payment: payments[randInt(0, payments.length - 1)]._id,
        shippingAddress: addrPair.ship,
        billingAddress: addrPair.bill,
        shippingMethod: 'standard',
        shippingCarrier: 'UPS',
        trackingNumber: `TRK-${Date.now()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
        coupon: Math.random() < 0.3 ? { code: 'WELCOME10', discount: 10 } : undefined,
        notes: 'Seed order',
      });
      await ord.save();
      orders.push(ord);
    }
  }
  console.log(`Inserted ${orders.length} orders`);
  return orders;
}

async function run() {
  try {
    await connect();
    if (CLEAR) await clearCollections();

    const customers = await seedCustomers();
    const addrMap = await seedAddresses(customers);
    const payments = await seedPayments();
    const orderItems = await seedOrderItems();
    await seedOrders(customers, addrMap, payments, orderItems);

    console.log('Seeding completed');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();
