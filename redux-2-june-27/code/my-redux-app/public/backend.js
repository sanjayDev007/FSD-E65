import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';

// File path for products storage
const productsFilePath = path.join(process.cwd(), 'products.json');

// In-memory storage for items
let items = [];
let nextId = 1;
let products = [];
let nextProductId = 1;

// Load products from file on startup
function loadProducts() {
    try {
        if (fs.existsSync(productsFilePath)) {
            const data = fs.readFileSync(productsFilePath, 'utf8');
            const loadedProducts = JSON.parse(data);
            products = loadedProducts;
            // Set nextProductId to the highest ID + 1
            if (products.length > 0) {
                nextProductId = Math.max(...products.map(p => p.id)) + 1;
            }
            console.log(`Loaded ${products.length} products from products.json`);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        products = [];
    }
}

// Save products to file
function saveProducts() {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        console.log(`Saved ${products.length} products to products.json`);
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

// Initialize with some default data
for (let i = 1; i <= 5; i++) {
    items.push({
        id: nextId++,
        title: `Sample Item ${i}`,
        body: `This is the description for item ${i}`,
        timestamp: new Date().toISOString()
    });
}

// Load products on startup
loadProducts();

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    
    // Items endpoints (existing)
    if (req.method === 'GET' && parsedUrl.pathname === '/api/items') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(items));
    } 
    else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/items/')) {
        const itemId = parseInt(parsedUrl.pathname.split('/')[3]);
        const item = items.find(item => item.id === itemId);
        
        if (item) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(item));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Item not found' }));
        }
    }
    else if (req.method === 'POST' && parsedUrl.pathname === '/api/items') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const newItem = JSON.parse(body);
                const item = {
                    id: nextId++,
                    title: newItem.title || 'Untitled',
                    body: newItem.body || 'No description',
                    timestamp: new Date().toISOString()
                };
                items.push(item);
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(item));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    // Products CRUD endpoints
    else if (req.method === 'GET' && parsedUrl.pathname === '/api/products') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
    }
    else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/products/')) {
        const productId = parseInt(parsedUrl.pathname.split('/')[3]);
        const product = products.find(product => product.id === productId);
        
        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
        }
    }
    else if (req.method === 'POST' && parsedUrl.pathname === '/api/products') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const newProduct = JSON.parse(body);
                const product = {
                    id: nextProductId++,
                    name: newProduct.name || 'Unnamed Product',
                    price: parseFloat(newProduct.price) || 0,
                    stock: parseInt(newProduct.stock) || 0,
                    status: newProduct.status || 'Active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                products.push(product);
                saveProducts(); // Save to file
                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(product));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/api/products/')) {
        const productId = parseInt(parsedUrl.pathname.split('/')[3]);
        const productIndex = products.findIndex(product => product.id === productId);
        
        if (productIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const updatedData = JSON.parse(body);
                const existingProduct = products[productIndex];
                
                products[productIndex] = {
                    ...existingProduct,
                    name: updatedData.name !== undefined ? updatedData.name : existingProduct.name,
                    price: updatedData.price !== undefined ? parseFloat(updatedData.price) : existingProduct.price,
                    stock: updatedData.stock !== undefined ? parseInt(updatedData.stock) : existingProduct.stock,
                    status: updatedData.status !== undefined ? updatedData.status : existingProduct.status,
                    updatedAt: new Date().toISOString()
                };
                
                saveProducts(); // Save to file
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(products[productIndex]));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/api/products/')) {
        const productId = parseInt(parsedUrl.pathname.split('/')[3]);
        const productIndex = products.findIndex(product => product.id === productId);
        
        if (productIndex === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
            return;
        }

        const deletedProduct = products.splice(productIndex, 1)[0];
        saveProducts(); // Save to file
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Product deleted successfully', product: deletedProduct }));
    }
    else if (req.method === 'GET' && parsedUrl.pathname === '/api/data') {
        // Generate 10000 data items (reduced from 1M for performance)
        const data = [];
        for (let i = 1; i <= 10000; i++) {
            data.push({
                id: i,
                name: `Item ${i}`,
                value: Math.floor(Math.random() * 1000),
                timestamp: new Date().toISOString()
            });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data, total: data.length }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
