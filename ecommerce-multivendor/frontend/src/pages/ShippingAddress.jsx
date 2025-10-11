import React, { useState, useEffect } from 'react';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../api';

function ShippingAddress() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const result = await getAddresses();
      if (result.success) {
        console.log(result);
        setAddresses(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateAddress(form.id, form);
      } else {
        await createAddress(form);
      }
      fetchAddresses();
      setIsEditing(false);
      setForm({
        id: null,
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        postalCode: ''
      });
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setForm({ ...addr, id: addr._id });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteAddress(id);
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shipping Addresses</h2>
      
      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{isEditing ? 'Edit Address' : 'Add New Address'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={form.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={form.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Company (Optional)</label>
            <input
              type="text"
              name="company"
              placeholder="Enter company name"
              value={form.company}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address 1</label>
            <input
              type="text"
              name="address1"
              placeholder="Enter street address"
              value={form.address1}
              onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address 2 (Optional)</label>
            <input
              type="text"
              name="address2"
              placeholder="Enter apartment, suite, etc."
              value={form.address2}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={form.state}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Enter country"
                value={form.country}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                placeholder="Enter postal code"
                value={form.postalCode}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Address' : 'Add Address')}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({
                    id: null,
                    firstName: '',
                    lastName: '',
                    company: '',
                    phone: '',
                    email: '',
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    country: '',
                    postalCode: ''
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && addresses.length === 0 ? (
          <p className="text-center col-span-full">Loading addresses...</p>
        ) : (
          addresses.map(addr => (
            <div key={addr._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">{addr.firstName} {addr.lastName}</h4>
              {addr.company && <p className="text-gray-600 mb-1"><strong>Company:</strong> {addr.company}</p>}
              <p className="text-gray-600 mb-1"><strong>Phone:</strong> {addr.phone}</p>
              <p className="text-gray-600 mb-1"><strong>Email:</strong> {addr.email}</p>
              <p className="text-gray-600 mb-1"><strong>Address:</strong> {addr.address1}{addr.address2 && `, ${addr.address2}`}, {addr.city}, {addr.state}, {addr.country} {addr.postalCode}</p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(addr)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  disabled={loading}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ShippingAddress;