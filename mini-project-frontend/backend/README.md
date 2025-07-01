# Mini Project Backend API

A Node.js Express backend with JWT authentication for user management, product management, and cart operations.

## Features

- JWT-based authentication
- Role-based authorization (Admin/User)
- User registration and login
- Product CRUD operations (Admin only)
- Shopping cart management
- Stock validation
- File-based data storage

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env` file and update JWT_SECRET for production

3. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "User" // or "Admin"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user (requires token)

#### POST `/api/auth/logout`
Logout user (requires token)

### Product Routes (`/api/products`)

#### GET `/api/products`
Get all products (requires authentication)

#### GET `/api/products/:id`
Get single product (requires authentication)

#### POST `/api/products`
Add new product (Admin only)
```json
{
  "name": "Product Name",
  "price": 29.99,
  "stock": 100,
  "description": "Product description"
}
```

#### PUT `/api/products/:id`
Update product (Admin only)
```json
{
  "name": "Updated Name",
  "price": 39.99,
  "stock": 50
}
```

#### DELETE `/api/products/:id`
Delete product (Admin only)

### Cart Routes (`/api/cart`)

#### GET `/api/cart`
Get user's cart (requires authentication)

#### POST `/api/cart/add`
Add item to cart
```json
{
  "productId": "product-uuid",
  "quantity": 2
}
```

#### PUT `/api/cart/update`
Update item quantity in cart
```json
{
  "productId": "product-uuid",
  "quantity": 3
}
```

#### DELETE `/api/cart/remove/:productId`
Remove item from cart

#### DELETE `/api/cart/clear`
Clear entire cart

#### POST `/api/cart/checkout`
Checkout cart (updates product stock)

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access

- **Admin**: Can manage products (create, read, update, delete)
- **User**: Can view products and manage their cart
- Both roles can access cart and authentication endpoints

## Data Storage

Data is stored in JSON files in the `utils/data/` directory:
- `users.json` - User accounts
- `products.json` - Product inventory

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

## Example Usage

1. Register as Admin:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"Admin"}'
```

2. Login and get token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

3. Add a product (Admin only):
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"name":"Laptop","price":999.99,"stock":10,"description":"Gaming laptop"}'
```

4. Register as User and add to cart:
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Regular User","email":"user@example.com","password":"user123","role":"User"}'

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user-token>" \
  -d '{"productId":"<product-id>","quantity":1}'
```