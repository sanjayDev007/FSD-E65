import {

ADD_TO_CART,
REMOVE_FROM_CART,
UPDATE_QUANTITY,
CLEAR_CART,
} from '../actions/cartActions';

// Load cart state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save cart state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cart', serializedState);
  } catch {
    // ignore write errors
  }
};

const initialState = loadState() || {
  items: [],
};

const cartReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }
      break;
    case REMOVE_FROM_CART:
      newState = {
        ...state,
        items: state.items.filter(item => item._id !== action.payload._id),
      };
      break;
    case UPDATE_QUANTITY:
      newState = {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      break;
    case CLEAR_CART:
      newState = {
        ...state,
        items: [],
      };
      break;
    default:
      return state;
  }
  saveState(newState);
  return newState;
};

export default cartReducer;