import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Modal, Select } from "flowbite-react";
import { FaFilter, FaSort, FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem, decreaseItemQuantity } from '../../redux/cart/cartSlice.js';
import Product from '../../APIs/Product.json';
import { Link, useNavigate } from 'react-router-dom';


const AllProductPage = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(100);
  const [region, setRegion] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  // const [cart, setCart] = useState([]); 
  const { items: cartItems, totalQuantity, totalAmount } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const filteredProducts = useMemo(() => {
    return Product
      .filter((Product) =>
        Product.price <= price &&
        (region === "All" || Product.region === region) &&
        (availability === "All" || Product.available.toString() === availability) &&
        Product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "priceLowToHigh":
            return a.price - b.price;
          case "priceHighToLow":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [price, region, availability, searchTerm, sortOption]);

  const resetFilters = () => {
    setPrice(100);
    setRegion("All");
    setAvailability("All");
    setSearchTerm("");
    setSortOption("default");
  };

  const handleNavigation = (path) => {
    // Navigate to the new page
    // navigate(path);
    window.location.href = path;
    // Scroll to top immediately after navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds smooth scrolling
    });
  };

  // Cartf function

  // view cart 
  // const viewCart = () => {
  //   console.log(cart); // For debugging, you can see the cart items in the console
  // };

  //function to check if item is in cart
  const getItemQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const openProductModal = (Product) => {
    setSelectedProduct(Product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false)
  }

  // Animations
  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      width: '18rem',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const productCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex min-h-screen bg-gray-50"
    >
      {/* Mobile Sidebar Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-500 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaFilter />}
      </motion.button>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={` inset-y-0 left-0 transform
  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  lg:relative lg:translate-x-0 
  w-80 bg-white shadow-xl z-0 
  transition-transform duration-[3000ms] ease-in-out
  p-6 overflow-y-auto
`}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaFilter className="mr-2" /> Filters
          </h2>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaSort className="mr-2" /> Sort By
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Default</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <input
              type="range"
              min="0"
              max="200"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Rs. 0</span>
              <span>Rs. {price}</span>
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="West">West</option>
              <option value="East">East</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button
              onClick={resetFilters}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-500 hover:text-white transition flex items-center justify-center"
            >
              <FaTimes className="mr-2" /> Clear Filters
            </button>
              <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
                onClick={() => handleNavigation('/purchase/yourcart')}
              >
                <FaShoppingCart className="mr-2" />
                View Cart ({totalQuantity} Items)
              </button>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1 p-6 lg:p-10 bg-gray-50">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-8"
          >
            All Products
          </motion.h2>

          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-white rounded-lg shadow"
            >
              <p className="text-gray-500 text-xl">No products found</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((Product) => (
                  <motion.div
                    key={Product.id}
                    variants={productCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    exit="hidden"
                    className="flex flex-col justify-between bg-white rounded-lg shadow-md overflow-hidden"
                    onClick={() => openProductModal(Product)}
                  >
                    <img
                      src={Product.image}
                      alt={Product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{Product.name}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Region: {Product.region}</span>
                        <span className="text-sm text-gray-600">Availability: {Product.available ? "In Stock" : "Out of Stock"}</span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">Rs.{Product.price}</p>

                      <div className="flex items-center mt-4">
                        {getItemQuantity(Product.id) > 0 ? (
                          <div className="flex items-center quantity-control">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from opening
                                dispatch(decreaseItemQuantity(Product.id));
                              }}
                              className="bg-gray-200 p-2 rounded-l"
                            >
                              <FaMinus />
                            </button>
                            <span className="px-4 py-2 bg-gray-100">
                              {getItemQuantity(Product.id)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent modal from opening
                                dispatch(addItem(Product));
                              }}
                              className="bg-gray-200 p-2 rounded-r"
                            >
                              <FaPlus />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent modal from opening
                              dispatch(addItem(Product));
                            }}
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <Modal
            show={isModalOpen}
            size="4xl"
            onClose={closeModal}
            popup
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Modal.Header />
              <Modal.Body>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold text-blue-600"> Rs. {selectedProduct.price}</span>
                      <span className="text-sm text-gray-600">Region: {selectedProduct.region}</span>
                    </div>
                    <p className="text-gray-500 mb-4">
                      Availability: {selectedProduct.available ? "In Stock" : "Out of Stock"}
                    </p>
                    <p className="text-base text-gray-700 mb-4">
                      {/* Add more product description or details here */}
                      This is a detailed description of the product, highlighting its features and benefits.
                    </p>
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          dispatch(addItem(selectedProduct));
                          closeModal();
                        }}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button color="blue" onClick={closeModal}>Close</Button>
              </Modal.Footer>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AllProductPage;