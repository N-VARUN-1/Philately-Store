import React from 'react'
import { motion } from 'framer-motion'

export default function HomeMain() {
  // Animation variants for the image
  const imageVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9,
      y: 50 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  // Parallax-like effect on mouse move
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 50;
    const moveY = (clientY - window.innerHeight / 2) / 50;

    e.currentTarget.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
  };

  // Reset transform on mouse leave
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0px, 0px)';
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="overflow-hidden rounded-2xl shadow-lg"
    >
      <motion.img 
        variants={imageVariants}
        src="/src/images/homaPg/homePage3.png" 
        alt="Home Page Banner" 
        className='w-full h-auto rounded-2xl object-cover'
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // Optional: Add subtle parallax effect
        style={{ 
          transition: 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      />
    </motion.div>
  )
}