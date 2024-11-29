import React, { useState } from "react";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const PhilatelicAccountForm = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.applicantName ||
      !formData.email ||
      !formData.password ||
      !formData.mailingAddress ||
      !formData.pin ||
      (!formData.subscriptionFrequency &&
        (!formData.recipientName || !formData.recipientAddress)) ||
      !formData.customerType // Ensure customer type is included
    ) {
      return setErrorMessage("Please fill out all required fields");
    }

    if (formData.pin.length > 6 || formData.pin.length < 6) {
      alert('Pincode should be 6 digits');
    }

    try {
      setLoading(true);
      // Send formData to the backend API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Convert formData to JSON
      });

      if (response.status === 409) {
        // User already exists
        setErrorMessage("User already exists with this email");
        return;
      }

      if (!response.ok) {
        console.log(error);
        throw new Error('Failed to submit form');
      }

      if (response.ok) {
        navigate('/signin')  // redirects to login page after successful sign up
      }

      const data = await response.json();

      console.log("Account Created:", data);
      alert("Account created successfully!");
    } catch (error) {
      console.error(error.message);
      setErrorMessage("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds smooth scrolling
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Information for New Users */}
      <div className="flex-1 bg-green-700 text-white flex flex-col justify-center items-center p-6">
        <div className="animate__animated animate__lightSpeedInLeft animate__fast text-center max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Discover the World of Philately</h2>
          <p className="text-lg mb-6">
            Open a Philatelic Deposit Account to access rare stamps, manage subscriptions, and connect with fellow stamp enthusiasts.
          </p>
          <div className="space-y-4">
            <div className="bg-white text-green-700 py-4 px-6 rounded-lg shadow-lg">
              Member Exclusive: Access to Stamp Collections
            </div>
            <div className="bg-white text-green-700 py-4 px-6 rounded-lg shadow-lg">
              Invitation to Philatelic Events
            </div>
            <div className="bg-white text-green-700 py-4 px-6 rounded-lg shadow-lg">
              Tips for Expanding Your Collection
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Application Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="animate__animated animate__lightSpeedInRight animate__fast w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">
            National Philatelic Deposit Account
          </h1>
          <form className=" flex flex-col gap-4" onSubmit={handleSubmit}>
            <Label value="Type of Customer" />
            <select
              id="customerType"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value="">Select Customer Type</option>
              <option value="privateIndividual">Private / Individual</option>
              <option value="stampDealer">Stamp Dealer / Shop</option>
              <option value="company">Company</option>
            </select>

            <Label value="Name of Applicant" />
            <TextInput
              type="text"
              placeholder="Applicant's Name"
              id="applicantName"
              onChange={handleChange}
            />

            <Label value="Email" />
            <TextInput
              type="text"
              placeholder="Email"
              id="email"
              onChange={handleChange}
            />

            <Label value="Password" />
            <div className="relative">
              <TextInput
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Create a Password"
                id="password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {isPasswordVisible ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>

            <Label value="Mailing Address" />
            <TextInput
              type="text"
              placeholder="Mailing Address"
              id="mailingAddress"
              onChange={handleChange}
            />

            <Label value="Pin" />
            <TextInput
              type="text"
              placeholder="Pin Code (6-digit)"
              id="pin"
              onChange={handleChange}
            />

            <Label value="Gift Subscription (Optional)" />
            <TextInput
              type="text"
              placeholder="Recipient's Name"
              id="recipientName"
              onChange={handleChange}
            />
            <TextInput
              type="text"
              placeholder="Recipient's Mailing Address"
              id="recipientAddress"
              onChange={handleChange}
            />

            <Label value="Subscription Frequency" />
            <select
              id="subscriptionFrequency"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value="">Select Subscription Frequency</option>
              <option value="onceAYear">Once a Year</option>
              <option value="twiceAYear">Twice a Year</option>
              <option value="fourTimesAYear">Four Times a Year</option>
              <option value="sixTimesAYear">Six Times a Year</option>
            </select>

            {errorMessage && (
              <div
                style={{
                  color: 'red',
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#ffeeee',
                  borderRadius: '5px'
                }}
              >
                {errorMessage}
              </div>
            )}
            
            <Button gradientDuoTone="greenToBlue" type="submit" disabled={loading}>
              {loading ? <Spinner color="info" aria-label="Info spinner example" /> : "Submit"}
            </Button>
            {/* {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhilatelicAccountForm;



