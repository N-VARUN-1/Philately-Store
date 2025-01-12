"use client";

import { useState, useEffect } from "react";
import { Avatar, Dropdown, DropdownItem, Navbar } from "flowbite-react";
import Logo from "../images/Logos/Logo1.png";
import { Outlet, Routes, useNavigate } from "react-router-dom";
import { FaBell, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess, signOut } from '../redux/user/userSlice.js';
import { clearCart } from '../redux/cart/cartSlice.js';
import { Link } from "react-router-dom";
import 'animate.css';


export default function NavbarComponent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  const NAVIGATION_ROUTES = [
    { path: '/explore/allProductPage', label: 'All Products Page' },
    { path: '/explore/allProductPage', label: 'Brochures' },
    { path: '/explore/allProductPage', label: 'Thematic Pack' },
    { path: '/explore/allProductPage', label: 'FDC(First day covers)' },
    { path: '/explore/allProductPage', label: 'Mint Stamps' },
    { path: '/explore/allProductPage', label: "Collector's Pack" },
  ];

  const products = [
    { id: 1, name: "Rare Stamp Collection" },
    { id: 2, name: "Philatelic Album" },
    { id: 3, name: "Stamp Collecting Supplies" },
    { id: 4, name: "Limited Edition Stamps" },
    { id: 5, name: "Stamp Catalog" },
  ];

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleSignIn = () => {
    setSignIn(true);
    dispatch(signInSuccess());
    navigate('/signin');
  }

  const handleSignOut = async () => {
    try {
      // Make a logout request to your backend
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important for handling cookies/sessions
      });

      if (response.ok) {
        // Dispatch actions to clear user state and cart
        dispatch(signOut()); // Clear user state
        dispatch(clearCart()); // Clear cart state

        // Remove user data from local storage
        localStorage.removeItem('user');

        // Navigate to home page
        navigate('/');
      } else {
        // Handle logout failure
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  }

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filteredSuggestions = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate('/explore/allProductPage');
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <>
      <Navbar
        fluid
        className="animate__animated animate__slideInDown bg-teal-400 mx-auto w-[100%] max-w-screen-4xl px-8 py-4 shadow-2xl z-40 sticky top-0"
      >
        <div className="flex items-center justify-center w-full space-x-15">
          {/* Navbar.Brand */}
          <Navbar.Brand className="flex items-center gap-2">
            <Avatar img={Logo} />
            <span className="self-center whitespace-nowrap text-xl font-semibold text-black">
              Philately Store
            </span>
          </Navbar.Brand>

          <div className="relative flex items-center mx-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="dark w-full max-w-md px-4 py-2 placeholder:text-black rounded-full bg-transparent text-black dark:text-black dark:bg-gray-700 border border-gray-900 dark:border-gray-900 focus:border-gray-900 dark:focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            {suggestions.length > 0 && (
              <div
                className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1"
                style={{ top: '3rem' }}
              >
                {suggestions.map(product => (
                  <div
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    {product.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Centered Navbar Links */}
          <Navbar.Collapse>
            <div className="flex items-center justify-center space-x-8">
              <Navbar.Link className="text-lg font-bold text-black" href="/">
                Home
              </Navbar.Link>
              <Navbar.Link className="text-lg font-bold text-black" href="/aboutPhilatelyStore">
                About
              </Navbar.Link>

              {/* Dropdown for Explore */}
              <div className=" relative group inline-block">
                <Navbar.Link
                  className=" text-lg font-bold text-black cursor-pointer"
                  onMouseEnter={handleMouseEnter}
                >
                  Explore
                </Navbar.Link>

                {isDropdownOpen && (
                  <div
                    className=" animate__animated animate__fadeIn animate__faster absolute left-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-48"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {NAVIGATION_ROUTES.map((route) => (
                      <Link
                        key={route.path}
                        to={route.path}
                        className=" rounded-lg block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Navbar.Link className="text-lg font-bold text-black" href="/contactPhilatelyStore">
                Contact
              </Navbar.Link>
            </div>
          </Navbar.Collapse>

          {/* Notification & Profile */}
          <div className="flex items-center space-x-10">
            <button
              onClick={toggleNotifications}
              className="text-black hover:text-gray-300 relative"
              aria-label="Toggle notifications"
            >
              <FaBell className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
              </span>
            </button>

            <div className="animate__animated animate__fadeIn animate__faster">
              <Dropdown
                arrowIcon={false}
                inline
                label={<Avatar alt="User settings" img="" rounded />}
                className="mt-14 animate__animated animate__fadeIn animate__faster rounded-lg"
              >
                <Dropdown.Header>
                  <span className="block text-sm">
                    @{currentUser?.data?.applicantName || currentUser?.applicantName || "FullName"}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {currentUser?.data?.email || currentUser?.email || "username@gmail.com"}
                  </span>
                </Dropdown.Header>
                <DropdownItem href="/purchase/order_history" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  Your Orders
                </DropdownItem>
                <DropdownItem href="/purchase/yourcart" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  Your Cart
                </DropdownItem>
                <Dropdown.Item
                  href="/signin"
                  onClick={handleSignIn}
                  style={{ display: currentUser ? "none" : "flex", justifyContent: "center", alignItems: "center", height: "100%" }}
                >
                  Login
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={handleSignOut}
                  style={{ display: currentUser ? "block" : "none" }}
                >
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </Navbar>


      {showNotifications && (
        <div
          className="animate__animated animate__fadeIn animate__faster fixed top-20 right-4 w-80 bg-white shadow-2xl rounded-lg border border-gray-200 z-50 animate-slide-in"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            <button
              onClick={toggleNotifications}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close notifications"
            >
              <FaTimes />
            </button>
          </div>

          {/* <div className="max-h-96 overflow-y-auto">
            {[1, 2, 3].map((notification) => (
              <div
                key={notification}
                className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    Notification {notification}
                  </span>
                  <span className="text-xs text-gray-500">
                    2 mins ago
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  This is a sample notification message for demonstration.
                </p>
              </div>
            ))}
          </div> */}
          <div className="p-4 text-center">No Notifications yet</div>

          {/* <div className="p-4 text-center">
            <button
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All Notifications
            </button>
          </div> */}

        </div>
      )}
    </>
  );
}



