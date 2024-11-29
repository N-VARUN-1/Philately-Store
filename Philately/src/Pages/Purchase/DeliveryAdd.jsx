import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Modal.css';
import { Link } from 'react-router-dom';
const DeliveryAddressForm = () => {
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  });
  const { currentUser } = useSelector(state => state.user);
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser?.data?._id;

    if (!userId) {
      console.log('userId required');
      return;
    }

    // Phone number validation
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert('Please enter a valid phone number.');
      return;
    }

    // Zip code validation
    const zipCodeRegex = /^\d{6}$/;
    if (!zipCodeRegex.test(formData.zipCode)) {
      alert('Please enter a valid zip code.');
      return;
    }

    try {
      const response = await fetch('/api/addr/save-deliveryAddr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      // alert(data.message || 'Delivery Address Saved Successfully!');

      // Show the success modal
      setModalVisible(true);

      // Reset form fields after successful submission
      setFormData({
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        // Redirect to home page or any other page
        window.location.href = '/purchase/paymentsgateway'; // Change this to your desired route
      }, 2000);
    } catch (error) {
      console.error('Error saving address', error);
      alert('Failed to save address. Please try again.');
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Form Section */}
        <div className=" w-3/4 bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center p-8">
          <div className="animate__animated animate__zoomIn animate__faster max-w-3xl w-full bg-white p-8 rounded-xl shadow-xl border border-gray-200">
            <h2 className="text-4xl font-bold text-blue-700 text-center mb-8">Delivery Address</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name and Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-lg font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-lg font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="+91 "
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-lg font-semibold">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your Address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              {/* City, State, Zip Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-lg font-semibold">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-lg font-semibold">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-lg font-semibold">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="6-Digit"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Save Address Button */}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition duration-300"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Text Section */}
        <div className=" w-1/4 bg-blue-400 text-bold-black items-center justify-center p-6 rounded-lg">
          <img className="animate__animated animate__slideInRight animate__faster w-64 h-64 mx-auto" src="/src/images/Delivery Background Removed.png" alt="Delivery Illustration" />
          <div className='animate__animated animate__slideInRight animate__faster bg-white rounded-lg p-1 shadow-2xl'>
            <h2 className="font-bold text-2xl mx-3 my-3">Fast & Reliable Delivery</h2>
            <ul className="m-6 space-y-1.5 text-bold">
              <li>🚚 Free shipping on orders over ₹499</li>
              <li>💳 Secure payment options</li>
              <li>📦 Hassle-free returns within 7 days</li>
              <li>🌍 Available in multiple countries</li>
            </ul>
          </div>
          <div className="animate__animated animate__slideInRight animate__faster order-summary bg-white mt-5 p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-5">Order Summary</h2>
            <p className="text-lg mb-1">
              <strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}
            </p>
            <p className="text-lg mb-6">
              <strong>Items in Cart:</strong> {totalQuantity}
            </p>

            <nav class="flex" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="ms-1 text-sm font-2xl text-gray-900 md:ms-2 dark:text-gray-900">Your Cart</span>
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-500 mx-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                  </div>
                </li>
                <li>
                  <div class="flex items-center">
                    <h2 class="text-lg font-md text-gray-900 hover:text-blue-600 dark:text-gray-900 dark:hover:text-white">Delivery Address</h2>
                    <svg className="rtl:rotate-180 w-4 h-4 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                  </div>
                </li>
                <li aria-current="page">
                  <div class="flex items-center">    
                    <span class="ms-1 text-sm font-2xl text-gray-500 md:ms-2 dark:text-gray-400">Checkout</span>
                  </div>
                </li>
              </ol>
            </nav>

          </div>
        </div>

        {/* Success Modal */}
        {isModalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="success-icon">
                <img src="/src/images/Logos/modalCheck.png" alt="check" />
              </div>
              <h2 className="modal-title">Delivery Address Saved Successfully!</h2>
              <p className="modal-message">You will be redirected shortly...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryAddressForm;




