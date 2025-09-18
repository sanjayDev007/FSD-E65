const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['Vendor', 'Admin'],
        default: 'Vendor'
    },
    owner: {
        type: Schema.Types.ObjectId,
        refPath: 'ownerModel'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);