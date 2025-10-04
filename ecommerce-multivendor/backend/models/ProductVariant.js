const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ProductVariantSchema = new Schema(
  {
    product: { type: Types.ObjectId, ref: 'Product', required: true, index: true },
    seller: { type: Types.ObjectId, ref: 'Vendor', index: true },
    name: { type: String, trim: true, required: true },
    sku: { type: String, trim: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    costPrice: { type: Number, min: 0 },
    stockQuantity: { type: Number, min: 0, default: 0 },
    lowStockThreshold: { type: Number, min: 0, default: 10 },
    attributes: {
      type: Map,
      of: String,
      default: {},
    }, // e.g., { size: 'M', color: 'Red' }
    images: [{ type: String, trim: true }],
    weight: { type: Number, min: 0 },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    barcode: { type: String, trim: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes
ProductVariantSchema.index({ product: 1, isActive: 1 });
ProductVariantSchema.index({ seller: 1, createdAt: -1 });

module.exports = mongoose.model('ProductVariant', ProductVariantSchema);
