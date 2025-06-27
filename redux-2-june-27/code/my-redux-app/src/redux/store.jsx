import { legacy_createStore } from "redux";

const initialState = {
    products: [
        {
          id: 1,
          name: 'Sample Product 1',
          price: 29.99,
          stock: 50,
          status: 'Active',
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          name: 'Sample Product 2',
          price: 49.99,
          stock: 25,
          status: 'Active',
          createdAt: new Date('2024-01-20').toISOString(),
          updatedAt: new Date('2024-01-20').toISOString()
        },
        {
          id: 3,
          name: 'Sample Product 3',
          price: 19.99,
          stock: 0,
          status: 'Inactive',
          createdAt: new Date('2024-01-25').toISOString(),
          updatedAt: new Date('2024-01-25').toISOString()
        }
      ],
      carts: []
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_PRODUCT':
            const newProduct = {
                ...action.payload,
                id: state.products.map(product => product.id).reduce((maxId, currentId) => Math.max(maxId, currentId), 0) + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            return {
                ...state,
                products: [...state.products, newProduct]
            };
        case 'UPDATE_PRODUCT':
           let updatedProducts = state.products.map((product) => {
                if (product.id === action.payload.id) {
                    return {
                        ...product,
                        ...action.payload.data,
                        updatedAt: new Date().toISOString()
                    };
                }
                return product;
            });
            return {
                ...state,
                products: updatedProducts
            };
        case 'DELETE_PRODUCT':
            const filteredProducts = state.products.filter(product => product.id !== action.payload.id);
            return {
                ...state,
                products: filteredProducts
            };
        case 'ADD_TO_CART':
            const existingCartItem = state.carts.find(item => item.id === action.payload.id);
            if (existingCartItem) {
                return {
                    ...state,
                    carts: state.carts.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: Number(item.quantity) + Number(action.payload.quantity) || 1 }
                            : item
                    )
                };
            } else {
                const productToAdd = state.products.find(product => product.id === action.payload.id);
                if (productToAdd) {
                    return {
                        ...state,
                        carts: [
                            ...state.carts,
                            {
                                ...productToAdd,
                                quantity: action.payload.quantity || 1
                            }
                        ]
                    };
                }
                return state;
            }
        case 'REMOVE_FROM_CART':
            const updatedCart = state.carts.filter(item => item.id !== action.payload.id);
            return {
                ...state,
                carts: updatedCart
            };
        case 'CLEAR_CART':
            return {
                ...state,
                carts: []
            };
        case 'UPDATE_CART_ITEM':
            const updatedCartItems = state.carts.map(item => {
                if (item.id === action.payload.id) {
                    return {
                        ...item,
                        quantity: action.payload.quantity
                    };
                }
                return item;
            });
            return {
                ...state,
                carts: updatedCartItems
            };
        default:
            return state;
    }
}

const store = legacy_createStore(productReducer);

export default store;