"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import config from "@config";

import "@styles/animation.css";
import Machines from "@components/Machines";

const HomePage = () => {
  const [res, setRes] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(config.apiUrl + "/ping");
      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }

      const data = await response.json();
      setRes(data.message);
      console.log(data.message)
    } catch (err) {}
  };

  // fetchData();

  return (
    <>
      <section className='flex flex-col justify-between items-center py-48 bg-color site-padding h-screen md:py-0 md:flex-row'>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className='left md:mb-0 mb-12'
        >
          <h1 className='md:text-8xl text-6xl mb-4 font-bold'>PixelPerfect</h1>
          <p className='md:text-3xl text-2xl font-semibold'>
            Elevate your images with precision transformations. Our expert touch
            enhances clarity, adjusts colors, and refines composition for
            maximum impact. Trust us to bring your vision to life with
            unparalleled accuracy and finesse.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className='right hidden md:block md:pr-12'
        >
          <div className='head'>
            <div className='eyes'>
              <span className='eye'></span>
              <span className='eye'></span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* <section className='flex justify-center items-center py-32 bg-white'>
        <div className='container'>
          <h2 className='text-6xl mb-4 font-semibold'>Our Services</h2>
          <p className='text-2xl'>
            Our services are designed to meet the needs of photographers,
            designers, and businesses. We offer a range of image editing
            services to enhance your images and help you achieve your vision.
          </p>
        </div>
      </section> */}

      <Machines />
    </>
  );
};

export default HomePage;
