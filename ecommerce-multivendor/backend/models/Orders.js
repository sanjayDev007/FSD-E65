const mongoose = require('mongoose');
const crypto = require('crypto');
const Customer = require('./Customer');
const Payment = require('./Payment');
const Address = require('./Address');

const { Schema, Types } = mongoose;

const OrderSchema = new Schema(
    {
        orderNumber: { type: String, unique: true, index: true },

        user: { type: Types.ObjectId, ref: 'Customer', required: true, index: true },

        // Use document references for items
        items: {
            type: [{ type: Types.ObjectId, ref: 'OrderItem' }],
            validate: [(v) => Array.isArray(v) && v.length > 0, 'Order must have at least 1 item'],
            required: true,
        },

        status: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
                'returned',
                'failed',
                'refunded',
            ],
            default: 'pending',
            index: true,
        },

        currency: { type: String, trim: true, default: 'USD' },

        itemsQuantity: { type: Number, min: 0, default: 0 },
        itemsTotal: { type: Number, min: 0, default: 0 },
        discountTotal: { type: Number, min: 0, default: 0 },
        taxTotal: { type: Number, min: 0, default: 0 },
        shippingTotal: { type: Number, min: 0, default: 0 },
        grandTotal: { type: Number, min: 0, default: 0 },

        // Reference Payment document
        payment: { type: Types.ObjectId, ref: 'Payment' },

        // Reference Address documents
        shippingAddress: { type: Types.ObjectId, ref: 'Address' },
        billingAddress: { type: Types.ObjectId, ref: 'Address' },

        // shipping and tracking
        shippingMethod: { type: String, trim: true },
        shippingCarrier: { type: String, trim: true },
        trackingNumber: { type: String, trim: true },
        shippedAt: { type: Date },
        deliveredAt: { type: Date },

        coupon: {
            code: { type: String, trim: true },
            discount: { type: Number, min: 0, default: 0 },
        },

        notes: { type: String, trim: true },
        metadata: { type: Map, of: String },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        strict: true,
    }
);

// Virtuals
OrderSchema.virtual('totalQuantity').get(function () {
    if (Array.isArray(this.items) && this.items.length && typeof this.items[0] === 'object' && this.items[0] !== null && 'quantity' in this.items[0]) {
        return this.items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    }
    return this.itemsQuantity || 0;
});

OrderSchema.virtual('isPaid').get(function () {
    if (typeof this.populated === 'function' && this.populated('payment') && this.payment && typeof this.payment === 'object') {
        const status = this.payment.status;
        return status === 'paid' || status === 'partially_refunded';
    }
    return false;
});

// Helpers
function generateOrderNumber() {
    const y = new Date();
    const ymd = `${y.getFullYear().toString().slice(-2)}${String(y.getMonth() + 1).padStart(2, '0')}${String(
        y.getDate()
    ).padStart(2, '0')}`;
    const rnd = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 hex chars
    return `ORD-${ymd}-${rnd}`;
}

OrderSchema.methods.recalculateTotals = async function () {
    const OrderItem = mongoose.model('OrderItem');
    const items = await OrderItem.find({ _id: { $in: this.items } }, { quantity: 1, price: 1, discount: 1, tax: 1 }).lean();

    let itemsTotal = 0;
    let discountTotal = 0;
    let taxTotal = 0;
    let qtyTotal = 0;

    items.forEach((it) => {
        const qty = Math.max(1, it.quantity || 1);
        const price = Math.max(0, it.price || 0);
        const discount = Math.max(0, it.discount || 0);
        const tax = Math.max(0, it.tax || 0);

        const lineBase = qty * price;
        itemsTotal += lineBase;
        discountTotal += discount;
        taxTotal += tax;
        qtyTotal += qty;
    });

    this.itemsQuantity = qtyTotal;
    this.itemsTotal = itemsTotal;
    this.discountTotal = discountTotal + (this.coupon?.discount || 0);
    this.taxTotal = taxTotal;
    this.shippingTotal = Math.max(0, this.shippingTotal || 0);
    this.grandTotal = Math.max(0, itemsTotal - this.discountTotal + taxTotal + this.shippingTotal);
};

// Hooks
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        this.orderNumber = generateOrderNumber();
    }
    if (!this.items || this.items.length === 0) return next(new Error('Order must have at least 1 item'));
    try {
        await this.recalculateTotals();
        next();
    } catch (err) {
        next(err);
    }
});

// Indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Order', OrderSchema);