const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath, defaultData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initializeFile(USERS_FILE);
initializeFile(PRODUCTS_FILE);

// Generic file operations
const readFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

const writeToFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    return false;
  }
};

// User operations
const getUsers = () => readFromFile(USERS_FILE);
const saveUsers = (users) => writeToFile(USERS_FILE, users);

const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  return saveUsers(users);
};

// Product operations
const getProducts = () => readFromFile(PRODUCTS_FILE);
const saveProducts = (products) => writeToFile(PRODUCTS_FILE, products);

const findProductById = (id) => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

const addProduct = (product) => {
  const products = getProducts();
  products.push(product);
  return saveProducts(products);
};

const updateProduct = (id, updatedProduct) => {
  const products = getProducts();
  const index = products.findIndex(product => product.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    return saveProducts(products);
  }
  return false;
};

const deleteProduct = (id) => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  return saveProducts(filteredProducts);
};

module.exports = {
  // User operations
  getUsers,
  saveUsers,
  findUserByEmail,
  addUser,
  
  // Product operations
  getProducts,
  saveProducts,
  findProductById,
  addProduct,
  updateProduct,
  deleteProduct
};