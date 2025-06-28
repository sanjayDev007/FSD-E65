import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItem } from '../redux/store';

function Carts() {
    const cartItems = useSelector(state => state.cart);
    console.log(cartItems);
    const dispatch = useDispatch();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    function handleCartUpdate(itemId, quantity=1, action) {
        const item = cartItems.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (action === 'increment') {
                quantity = item.quantity + 1;
            } else if (action === 'decrement') {
                quantity = item.quantity - 1;
                if (quantity < 1) {
                    quantity = 1;
                }
            }
            dispatch(updateCartItem({ id: itemId, quantity }));
        }
    }
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">No Image</span>
                                </div>
                                <div className="flex-1 ml-4">
                                    <h4 className="font-semibold text-lg">{item.name}</h4>
                                    <p className="text-gray-600">${item.price}</p>
                                    <p className="text-sm text-green-600">Stock: {item.stock}</p>
                                </div>
                                <div className="flex items-center space-x-2 mx-4">
                                    <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center" onClick={()=>handleCartUpdate(item.id,item.quantity,"decrement")}>-</button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center" onClick={()=>handleCartUpdate(item.id,item.quantity,"increment")}>+</button>
                                </div>
                                <div className="text-lg font-semibold mx-4">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={()=>dispatch(removeFromCart({id:item.id}))}>Remove</button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="text-right mb-4">
                            <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold">
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Carts