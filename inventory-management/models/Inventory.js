const JsonDb = require('./db');
const Operations = require('./operations');
const inventorySchema = {
    id: { required: true },
    name: { required: true },
    quantity: { required: true },
    price: { required: true },
    category: { required: false },
    stock: { required: false }
};

const db = new JsonDb('inventory.json');
module.exports = new Operations(db, inventorySchema);