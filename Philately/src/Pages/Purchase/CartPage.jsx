import React, { useEffect, useState } from 'react';
import { Button, Modal } from "flowbite-react";
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, decreaseItemQuantity, clearCart, fetchUserCart } from '../../redux/cart/cartSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CartPage = () => {
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCartSaved, setIsCartSaved] = useState(false);
  const [isCheckingCartStatus, setIsCheckingCartStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRemoveItem = (id) => {
    setItemToRemove(id);
    setOpenModal(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      dispatch(removeItem(itemToRemove));
      setItemToRemove(null);
    }
    setOpenModal(false);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      dispatch(clearCart());
    }
  };


  const handleSaveCart = async () => {
    setIsLoading(true);

    if (!currentUser?.data?._id) {
      setShowLoginPrompt(true);
      setIsLoading(false);
      return;
    }

    if (items.length === 0) {
      toast.warning('Cannot save an empty cart');
      setIsLoading(false);
      return;
    }

    const userId = currentUser.data._id;

    try {
      setIsCheckingCartStatus(true);
      const response = await fetch('/api/cart/save-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          items,
          totalQuantity,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save cart');
      }

      toast.success(data.message || 'Cart saved successfully!');
      setIsCartSaved(true);
      setModalVisible(true);

      // Delay navigation for user experience
      setTimeout(() => {
        console.log("Redirecting to /purchase/yourcart...");
        setModalVisible(false); // Close modal before redirect
        navigate('/purchase/yourcart');
      }, 2000);
    } catch (error) {
      console.error('Error saving cart:', error);
      toast.error(error.message || 'Failed to save cart. Please try again later.');
      setIsCartSaved(false);
    } finally {
      setIsCheckingCartStatus(false);
      setIsLoading(false);
    }
  };


  const handleProceedToCheckout = () => {
    // Comprehensive validation
    if (!currentUser?.data?._id) {
      setShowLoginPrompt(true);
      return;
    }

    if (items.length === 0) {
      toast.warning('Your cart is empty', {
        position: "top-center",
      });
      return;
    }

    if (!isCartSaved) {
      toast.warning('Please save your cart before proceeding to checkout', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Additional validation if needed
    if (totalAmount <= 0) {
      toast.error('Invalid cart total');
      return;
    }

    // Proceed to checkout
    navigate('/purchase/deliveryaddress');
  };


  const checkCartSaveStatus = async () => {
    if (!currentUser || !currentUser.data || !currentUser.data._id) {
      setIsCartSaved(false);
      return;
    }

    try {
      setIsCheckingCartStatus(true);
      // Change from userId to _id
      const response = await fetch(`/api/cart/check-save-status/${currentUser.data._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Add error handling for response
      if (!response.ok) {
        throw new Error('Failed to fetch cart status');
      }

      const data = await response.json();

      // Add more robust checking
      setIsCartSaved(data.success && data.isSaved);
    } catch (error) {
      console.error('Error checking cart save status:', error);
      setIsCartSaved(false);
      toast.error('Unable to verify cart status');
    } finally {
      setIsCheckingCartStatus(false);
    }
  };

  useEffect(() => {
    // Only check cart status if user is logged in and there are items
    if (currentUser?.data?._id && items.length > 0) {
      checkCartSaveStatus();
    }
  }, [currentUser, items.length]); // Use items.length for more precise tracking


  return (
    <div
      className="cart-page grid grid-cols-3 gap-6 p-6 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Column: Shopping Cart Items */}
      <div className="animate__animated animate__fadeIn cart-items col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
        {items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-xl">Your cart is empty.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="cart-item flex items-center justify-between border-b py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <img
                  src={item.image || 'https://via.placeholder.com/150'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Price: Rs. {item.price}</p>
                  <p className="text-gray-600 text-sm">Colour: {item.color || "Default"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => dispatch(decreaseItemQuantity(item.id))}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="px-4 py-2 border">{item.quantity}</span>
                <button
                  onClick={() => dispatch(addItem(item))}
                  className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition"
                >
                  +
                </button>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
              <p className="text-lg font-bold">Total: Rs. {item.price * item.quantity}</p>
            </div>
          ))
        )}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleClearCart}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            Clear Cart
          </button>
          <button
            onClick={handleSaveCart}
            disabled={isLoading || isCheckingCartStatus || isCartSaved}
            className={`
    py-2 px-4 rounded transition
    ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : (isCartSaved
                  ? 'bg-green-500 text-white cursor-pointer'
                  : 'bg-blue-500 text-white hover:bg-blue-600')
              }
  `}
          >
            {isLoading
              ? 'Saving...'
              : (isCartSaved
                ? 'Cart Saved'
                : 'Save Cart')
            }
          </button>
        </div>
      </div>
      
      {isModalVisible && (
        <div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="modal-content">
            <div className="success-icon">
              <img src="/src/images/Logos/modalCheck.png" alt="check" />
            </div>
            <h2 className="modal-title">Your Cart Saved Successfully!</h2>
            <h3>Thank you</h3>
          </div>
        </div>
      )}


      {/* Right Column: Summary Panel */}
      <div className="animate__animated animate__fadeIn order-summary bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <p className="text-lg mb-2">
          <strong>Total Amount:</strong> Rs. {totalAmount.toFixed(2)}
        </p>
        <p className="text-lg mb-6">
          <strong>Items in Cart:</strong> {totalQuantity}
        </p>
        <button
          onClick={handleProceedToCheckout}
          className={`
            w-full py-2 px-4 rounded transition
            ${!isCartSaved || items.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
          disabled={!isCartSaved || items.length === 0 || isCheckingCartStatus}
        >
          {isCheckingCartStatus
            ? 'Checking Cart...'
            : (!isCartSaved
              ? 'Save Cart First'
              : 'Proceed to Checkout')
          }
        </button>
        {!isCartSaved && (
          <div className="mt-2 text-center text-red-500 text-sm">
            Please save your cart before checkout
          </div>
        )}

        <nav className="w-full flex items-center justify-center p-20" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li aria-current="page">
              <div className="flex items-center">
                <span className="ms-1 text-xl font-2xl text-gray-900 md:ms-2 dark:text-gray-900">Your Cart</span>
                <svg className="rtl:rotate-180 w-4 h-4 text-gray-900 mx-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                </svg>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <a href="#" className="ms-1 text-sm font-xl text-gray-500 hover:text-blue-600 md:ms-2 dark:text-gray-900 dark:hover:text-white">Delivery Address</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="rtl:rotate-180 w-3 h-3 text-gray-500 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                </svg>
                <span className="ms-1 text-sm font-xl text-gray-500 hover:text-blue-600 md:ms-2 dark:text-gray-900 dark:hover:text-white">Checkout</span>
              </div>
            </li>
          </ol>
        </nav>

      </div>
      
      {showLoginPrompt && (
        <div
          className="animate__animated animate__fadeIn animate__faster fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} // Initial state
          animate={{ opacity: 1 }} // Animate to full opacity
          exit={{ opacity: 0 }} // Animate back to opacity 0 on exit
          transition={{ duration: 0.3 }} // Duration of the animation
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
            initial={{ scale: 0.8 }} // Start slightly smaller
            animate={{ scale: 1 }} // Scale to full size
            exit={{ scale: 0.8 }} // Scale back down on exit
            transition={{ duration: 0.3 }} // Duration of the scaling animation
          >
            <h2 className="text-xl font-bold mb-4 text-center">Login Required</h2>
            <p className="mb-4 text-center text-gray-600">
              Please log in to proceed with checkout.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/signin')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for confirming item removal */}
      <Modal className='animate__animated animate__fadeIn animate__faster' show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Body>
          <p className=" text-base text-gray-500">
            Are you sure you want to remove this item from your cart?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={confirmRemoveItem}>
            Yes, Remove
          </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartPage;





