
import React from "react";
import OAuth from '../Components/OAuth-admin';

const adminSignIn = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section - Sign-In Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 text-center">Postal Circle Admin Login</h1>
          <p className="text-gray-500 text-center mb-6">Sign in to access the admin dashboard</p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Admin ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center">
                <input type="checkbox" className="mr-1" />
                Remember Me
              </label>
              <a href="#" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
            <OAuth/>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Not an admin? <a href="#" className="text-blue-500 hover:underline">Go back to main site</a>
          </p>
        </div>
      </div>

      {/* Right Section - Display Content */}
      <div className="flex-1 bg-blue-600 text-white flex flex-col justify-center items-center p-6">
        <div className="text-center max-w-lg">
          <h2 className="text-3xl font-semibold mb-4">Postal Services Management</h2>
          <p className="text-lg mb-6">
            Manage postal routes, scheduling, delivery tracking, and resource allocation efficiently from your
            admin dashboard. Ensure smooth operations and enhance the postal service experience.
          </p>
          <div className="space-y-4">
            <div className="bg-white text-blue-600 py-4 px-6 rounded-lg shadow-lg font-semibold">
              Route Management System
            </div>
            <div className="bg-white text-blue-600 py-4 px-6 rounded-lg shadow-lg font-semibold">
              Delivery Scheduling & Tracking
            </div>
            <div className="bg-white text-blue-600 py-4 px-6 rounded-lg shadow-lg font-semibold">
              Resource Allocation Tools
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default adminSignIn;