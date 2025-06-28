import { configureStore, createSlice } from "@reduxjs/toolkit";
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage:", error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load state from localStorage:", error);
    return undefined;
  }
};
const persistedState = loadFromLocalStorage();
const initialState = {
  products: [],
  carts: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState.products,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id:
          state.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.push(newProduct);
    },
    updateProduct: (state, action) => {
      return state.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            ...action.payload.data,
            updatedAt: new Date().toISOString(),
          };
        }
        return product;
      });
    },
    deleteProduct: (state, action) => {
      return state.filter((product) => product.id !== action.payload.id);
    },
  },
});

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState.carts,
  reducers: {
    addToCart: (state, action) => {
      console.log("State before adding to cart:", state);
      const existingCartItem = state.find(
        (item) => item.id === action.payload.id
      );
      if (existingCartItem) {
        existingCartItem.quantity =
          Number(existingCartItem.quantity) +
          Number(action.payload.quantity || 1);
      } else {
        let localStorageItem = JSON.parse(localStorage.getItem("reduxState"));
        let product = localStorageItem?.product?.find(
          (item) => item.id === action.payload.id )
        state.push({
          ...product,
          quantity: action.payload.quantity || 1,
        });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter((item) => item.id !== action.payload.id);
    },
    clearCart: () => {
      return [];
    },
    updateCartItem: (state, action) => {
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            quantity: action.payload.quantity,
          };
        }
        return item;
      });
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productSlice.actions;
export const { addToCart, removeFromCart, clearCart, updateCartItem } =
  cartSlice.actions;

const store = configureStore({
  reducer: {
    product: productSlice.reducer,
    cart: cartSlice.reducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
export default store;
