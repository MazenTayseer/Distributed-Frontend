"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FaBars, FaXmark } from "react-icons/fa6";

const Nav = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);

    if (!showNavbar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeNavbar = () => {
    setShowNavbar(false);
    document.body.style.overflow = "";
  };

  return (
    <nav className='py-6 w-full flex flex-wrap items-center justify-between text-center bg-white site-padding'>
      <Link href='/' onClick={closeNavbar}>
        <h1 className='md:text-3xl text-2xl max-[340px]:text-xl text-customWhite font-bold'>
          PixelPerfect
        </h1>
      </Link>

      {/* Desktop */}
      <div className='hidden w-full md:block md:w-auto'>
        <Link
          href='/'
          className='py-3 px-9 mx-2 font-bold rounded-lg transition duration-300 ease-in-out hover:brightness-75'
        >
          Home
        </Link>

        <Link
          href='/'
          className='py-3 px-9 mx-2 font-bold rounded-lg transition duration-300 ease-in-out hover:brightness-75'
        >
          Services
        </Link>

        <Link
          href='/operations'
          className='py-3 px-9 mx-2 font-bold rounded-lg transition duration-300 ease-in-out hover:brightness-75'
        >
          Operations
        </Link>

        <Link
          href='/classification'
          className='py-3 px-9 mx-2 font-bold rounded-lg transition duration-300 ease-in-out hover:brightness-75'
        >
          Classification
        </Link>
      </div>

      {/* Mobile */}
      <button
        onClick={toggleNavbar}
        className='block text-xl sm:text-2xl text-customWhite mr-4 focus:outline-none md:hidden'
      >
        {showNavbar ? <FaXmark /> : <FaBars />}
      </button>

      <AnimatePresence>
        {showNavbar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            // exit={{ opacity: 0, y: -20 }}
            className='h-screen z-10 w-full flex flex-col gap-4 pt-8 md:hidden'
          >
            <Link
              href='/'
              onClick={closeNavbar}
              className='py-3 px-9 font-bold rounded-lg lime_btn_hover'
            >
              Home
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;
