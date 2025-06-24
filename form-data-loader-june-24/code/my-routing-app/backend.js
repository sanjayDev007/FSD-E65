import http from 'http';
import url from 'url';

// In-memory storage for items
let items = [];
let nextId = 1;
let products = [];

// Initialize with some default data
for (let i = 1; i <= 5; i++) {
    items.push({
        id: nextId++,
        title: `Sample Item ${i}`,
        body: `This is the description for item ${i}`,
        timestamp: new Date().toISOString()
    });
}

function generateProducts(newProducts = [], lastIndex = 1) {
    if (products.length === 0) {
        const productNames = ['Gaming Headset', 'Webcam HD', 'Phone Stand', 'Cable Organizer', 'Power Bank', 'Bluetooth Speaker', 'Tablet', 'Smart Watch', 'Earbuds', 'Desk Lamp', 'External SSD', 'Graphics Card', 'Memory Card', 'Router', 'Printer'];
        
        for (let i = lastIndex; i <= 5000; i++) { // Reduced from 1.5M to 1000 for performance
            const randomName = productNames[(i - 1) % productNames.length]; // Use modulo to cycle through names
            const randomPrice = Math.floor(Math.random() * 1000) + 29.99;
            const randomStock = Math.floor(Math.random() * 100);
            const status = randomStock > 0 ? 'Active' : 'Out of Stock';
            
            newProducts.push({
                id: i,
                name: randomName,
                price: parseFloat(randomPrice.toFixed(2)),
                stock: randomStock,
                status: status
            });
        }
    }
    return newProducts;
}

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    
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
    else if (req.method === 'GET' && parsedUrl.pathname === '/api/products') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Generate products if not already generated
        if (products.length === 0) {
            products = generateProducts([], 1);
        }
        res.end(JSON.stringify(products));
    }
    else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/products/')) {
        const productId = parseInt(parsedUrl.pathname.split('/')[3]);
        
        // Ensure products are generated before searching
        if (products.length === 0) {
            products = generateProducts([], 1);
        }
        
        const product = products.find(product => product.id === productId);
        
        if (product) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(product));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
        }
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