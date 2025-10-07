const mongoose = require('mongoose');
const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', AddressSchema);
