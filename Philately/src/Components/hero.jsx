import React, { useState } from "react";
import { Carousel } from "flowbite-react";
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import { useRef } from "react";

import {
  FaEnvelope,
  FaMedal,
  FaGlobeEurope,
  FaStamp,
  FaBook
} from 'react-icons/fa';

// Import images
import Img1 from '../images/hero-carousal/img1.jpg';
import Img2 from '../images/hero-carousal/img2.png';
import Img3 from '../images/hero-carousal/img3.png';
import Img4 from '../images/hero-carousal/img4.png';
import HomeMain from "../Pages/HomeMain";

export default function HeroComponent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Navigate to the new page
    navigate(path);

    // Scroll to top immediately after navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: adds smooth scrolling
    });
  };

  // Ref for Categories Section
  const categoriesRef = useRef(null);
  const isInView = useInView(categoriesRef, { 
    once: true,  // Animation triggers only once
    amount: 0.2,  // 20% of the section is visible
  });
  const categoriesInView = useInView(categoriesRef, { 
    once: true,  // Animation triggers only once
    amount: 0.2  // 20% of the section is visible
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const images = [
    Img1,
    Img2,
    Img3,
    Img4
  ];

  const categories = [
    {
      name: "First Day Covers",
      icon: <FaEnvelope className="text-5xl text-green-600" />,
      description: "Historical postal moments captured"
    },
    {
      name: "Commemorative Stamps",
      icon: <FaMedal className="text-5xl text-green-600" />,
      description: "Celebrate significant events"
    },
    {
      name: "Thematic Packs",
      icon: <FaGlobeEurope className="text-5xl text-green-600" />,
      description: "Curated stamp collections"
    },
    {
      name: "Mint Stamps",
      icon: <FaStamp className="text-5xl text-green-600" />,
      description: "Pristine, uncirculated stamps"
    },
    {
      name: "Collector's Guides",
      icon: <FaBook className="text-5xl text-green-600" />,
      description: "Expert philatelic resources"
    }
  ];

  const collections = [
    {
      name: "Vintage World War II Commemoratives",
      price: "Rs. 50",
      image: "/src/images/feature_collections/Vintage World War II Commemoratives.jpg"
    },
    {
      name: "India Postage 2009 Major General Dewan Misri Chand block 4 mint stamps",
      price: "Rs. 30",
      image: "/src/images/feature_collections/India Postage 2009 Major General Dewan Misri Chand block 4 mint stamps.jpg"
    },
    {
      name: "Fist Day Covers",
      price: "Rs. 25",
      image: "/src/images/feature_collections/FDC.jpg"
    }
  ];

  const transition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.2 }
  };

  React.useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        (prevSlide + 1) % images.length
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, [images.length]);


  return (
    <div className="space-y-6">
      <HomeMain />
      {/* Carousel Section */}
      <div className="relative w-full h-72 sm:h-96 xl:h-[28rem] 2xl:h-[40rem] overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentSlide}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={transition}
            custom={1} // Direction of slide
            className="absolute w-full h-full"
          >
            <img
              src={images[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Optional Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
              w-3 h-3 rounded-full 
              ${currentSlide === index ? 'bg-white' : 'bg-gray-300'}
            `}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <motion.section
        ref={categoriesRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-8"
          >
            Our Philatelic Categories
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-5 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-2xl text-center hover:shadow-xl transition-all"
              >
                {category.icon}
                <h3 className="text-xl font-semibold mt-4">{category.name}</h3>
                <p className="text-gray-600 mt-2">{category.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Collections */}
      <motion.section
        ref={categoriesRef}
        initial={{ opacity: 0, y: 50 }}
        animate={categoriesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6 }}
        className={isInView ? "py-16 animate__animated animate__bounceInLeft" : ''}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Collections
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div onClick={() => handleNavigation('/explore/allProductPage')}>
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-semibold">{collection.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-green-600 font-bold text-2xl">
                        {collection.price}
                      </span>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}