const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const OrderItemSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: { type: Types.ObjectId, ref: 'ProductVariant' },
    seller: { type: Types.ObjectId, ref: 'Vendor', index: true },
    sku: { type: String, trim: true },
    title: { type: String, trim: true },
    variantName: { type: String, trim: true },
    image: { type: String, trim: true },

    quantity: {
      type: Number,
      min: 1,
      required: true
    },
    price: {
      type: Number,
      min: 0,
      required: true
    },
    discount: {
      type: Number,
      min: 0,
      default: 0
    },
    tax: {
      type: Number,
      min: 0,
      default: 0
    },

    lineTotal: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

OrderItemSchema.methods.recalculate = function () {
  const qty = Math.max(1, this.quantity || 1);
  const price = Math.max(0, this.price || 0);
  const discount = Math.max(0, this.discount || 0);
  const tax = Math.max(0, this.tax || 0);
  const lineBase = qty * price;
  this.lineTotal = Math.max(0, lineBase - discount + tax);
};

OrderItemSchema.pre('validate', function (next) {
  this.recalculate();
  next();
});

OrderItemSchema.index({ seller: 1, createdAt: -1 });

module.exports = mongoose.model('OrderItem', OrderItemSchema);
