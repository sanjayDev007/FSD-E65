const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

const PaymentSchema = new Schema(
    {
        method: {
            type: String,
            enum: ['cod', 'card', 'paypal', 'stripe', 'razorpay', 'wallet', 'bank'],
            default: 'cod',
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
            default: 'pending',
        },
        provider: { type: String, trim: true },
        transactionId: { type: String, trim: true },
        paidAt: { type: Date },
        gatewayResponse: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);