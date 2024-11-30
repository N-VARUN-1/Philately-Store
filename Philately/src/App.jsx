import React from 'react'
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Navbar from '../src/Components/Navbar';
import HomePage from './Pages/HomePage'
import Footer from './Components/footer';

import HomeMain from './Pages/HomeMain';

export default function App() {
  const location = useLocation();
  return (
    <>
      <Navbar/>
      <main>
        {location.pathname === '/' && <HomePage/>}
        <Outlet/>
      </main>
      <Footer/>
    </>
  )
}
