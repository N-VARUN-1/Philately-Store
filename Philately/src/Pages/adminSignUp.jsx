import { Button, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import OAuth from '../Components/OAuth-admin';

const SignUp = () => {
  const [formData, setformData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setformData({...formData, [e.target.id] : e.target.value.trim()})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form Data:', formData); 

    if (!formData.adminId || !formData.FullName || !formData.email || !formData.password || !formData.confirmPassword) {
      console.log('Missing fields detected');
      return setErrorMessage("Please fill out all the fields");
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/admin-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      // console.log('Response:', data);

      if (res.ok) {
        setLoading(false);
        navigate('/');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Section - Sign-Up Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-2 text-center">New Postal Circle Admin Sign Up</h1>
          <p className="text-gray-500 text-center mb-6">Create an account to access the admin dashboard</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              id="adminId"
              placeholder="Admin ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <input
              type="text"
              id="FullName"
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleChange}
            />
            <Button className="w-full" color='blue' type='submit' disabled={loading}> 
              {
                loading ? (
                  <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>              {/*Important concept*/}
                  </>
                ) : 'Sign Up'
              }
            </Button>
            <OAuth/>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Information Display */}
      <div className="flex-1 bg-blue-600 text-white flex flex-col justify-center items-center p-6">
        <div className="text-center max-w-lg">
          <h2 className="text-3xl font-semibold mb-4">Join the Postal Circle Admin Team</h2>
          <p className="text-lg mb-6">
            As an admin, you’ll gain access to tools that help manage postal routes, track deliveries, allocate resources,
            and ensure the highest level of service efficiency.
          </p>
          <div className="space-y-4">
            <div className="bg-white text-blue-600 py-4 px-6 rounded-lg shadow-lg font-semibold">
              Access Route Management Tools
            </div>
            <div className="bg-white text-blue-600 py-4 px-6 rounded-lg shadow-lg font-semibold">
              Track Deliveries and Allocate Resources
            </div>
            <div className="bg-white text-blue-600 py-4 px-6 rounded-lg shadow-lg font-semibold">
              Enhance Postal Service Efficiency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;