import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CLEAR_CART } from '../store/actions/cartActions';

const Success = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear cart on successful payment
        dispatch({ type: CLEAR_CART });
    }, [dispatch]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been processed successfully.</p>
        </div>
        <a href="/" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Success;
