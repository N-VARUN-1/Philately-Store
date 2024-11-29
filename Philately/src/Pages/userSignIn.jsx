import React, { useState } from "react";
import { AiFillGoogleCircle } from 'react-icons/ai';
import OAuth from "../Components/OAuth-user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure, signInStart, signOut } from "../redux/user/userSlice";
import { fetchUserCart } from "../redux/cart/cartSlice.js";
import { Spinner } from "flowbite-react";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = async (e) => {
      const { id, value } = e.target;
      setFormData({
        ...formData,
        [id]: value.trim(),
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate form fields
    if (!formData.email || !formData.userId || !formData.password) {
      setErrorMessage("Please fill out all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('https://philately-store-bk-new-iota.vercel.app/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // const data = await response.json();
      const data = response.ok ? await response.json() : null;

      if (!response.ok) {
        // Handle error response from server
        setErrorMessage(data.message || "Sign in failed");
        setIsLoading(false);
        return;
      }

      dispatch(signInSuccess({
        userId: formData.userId,
        data // Optional
      }));

      if (data.user && data.user._id) {
        dispatch(fetchUserCart(data.user._id)); // Fetch user's cart
      }

      if(response.ok){
        setIsLoading(false);
        console.log('User verified')
        navigate('/');
      }

    } catch (error) {
      console.log("Sign in error:", error);
      setErrorMessage("An unexpected error occurred");
      setIsLoading(false);
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds smooth scrolling
    });
  }
  
  return (
    <div className="flex h-screen">
      {/* Left Section - Information for Philatelists */}
      <div className="flex-1 bg-green-700 text-white flex flex-col justify-center items-center p-6">
        <div className="animate__animated animate__lightSpeedInLeft animate__fast text-center max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Explore Rare and Collectible Stamps</h2>
          <p className="text-lg mb-6">
            Discover new stamps, manage your collection, and connect with other philatelists worldwide.
          </p>
          <div className="space-y-4">
            <div className="bg-white text-green-700 py-4 px-6 rounded-lg shadow-lg">
              Stamp of the Month: Vintage Series
            </div>
            <div className="bg-white text-green-700 py-4 px-6 rounded-lg shadow-lg">
              Guide to Rare Stamps
            </div>
            <div className="bg-white text-green-700 py-4 px-6 rounded-lg shadow-lg">
              Tips on Maintaining Your Collection
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="animate__animated animate__lightSpeedInRight animate__fast w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back, Philatelist!</h1>
          <p className="text-gray-500 text-center mb-6">Sign in to manage your stamp collection</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              id="userId"
              placeholder="User Id"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
              value={formData.userId}
              onChange={handleChange}
            />
            <input
              type="text"
              id="password"
              placeholder="Your Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" />
                Remember Me
              </label>
              <a href="#" className="text-green-500 hover:underline">
                Forgot User Id?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? <Spinner color="info" aria-label="Info spinner example" /> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-500 mt-6">
            New to philately?{" "}
            <a href="/user-signup" className="text-green-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
