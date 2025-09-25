const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema({
    label: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
    isDefault: { type: Boolean, default: false }
}, { _id: false });

const CustomerSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    addresses: { type: [AddressSchema], default: [] },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    meta: { type: Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
