import React from 'react';
import Sidebar from '../Components/sidebar';
// import HomeMain from '../Pages/HomeMain';
import Hero from '../Components/hero';
import Sidebar2 from '../Components/sidebar2';
import HomeMain from './HomeMain';

export default function HomePage() {
  return (
    // <div className="bg-gray-800 flex flex-row min-h-screen gap-7"> {/* Sidebar with full height */}
    //     <Sidebar />
    //   <div className="flex-1 bg-white">
    //       <Hero />
    //   </div>
    // </div>
    <>
    <div className='flex flex-row min-h-screen gap-7 rounded p-4'>
      {/* <Sidebar/> */}
      <div className="flex-1 z-999">
        <Hero/>
      </div>
    </div>
    </>
    
  );
}
