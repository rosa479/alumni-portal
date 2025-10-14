// /src/components/PlatinumJubilee.jsx

import React from "react";
import { motion, useSpring } from "framer-motion";
import { Award, Stamp, Coins } from "lucide-react";
import stampsImage from "../../assets/platinum/stamps.png";
import coinImage from "../../assets/platinum/coins.png";

// Placeholder images for the floating PNG and interactive elements
// You'll replace these with your actual images later
import floatingPngPlaceholder from "../../assets/platinum/logo-1.png";
import interactiveIcon1 from "../../assets/platinum/logo-1.png"; // Example icon
import interactiveIcon2 from "../../assets/platinum/logo-1.png"; // Example icon

// --- Data for the component ---
const commemorativeEvents = {
  title: "Commemorative",
  icon: <Award className="w-8 h-8 text-yellow-500" />,
  items: [
    {
      name: "Release of Postage Stamps",
      icon: <Stamp className="w-6 h-6 mr-3 text-blue-600" />,
      image: stampsImage,
      description:
        "Commemorative postage stamps honoring 75 years of IIT Kharagpur.",
    },
    {
      name: "Release of Commemorative Coin",
      icon: <Coins className="w-6 h-6 mr-3 text-yellow-600" />,
      image: coinImage,
      description: "A special ₹75 coin minted to mark this historic occasion.",
    },
  ],
};

// --- Main Platinum Jubilee Component ---
const PlatinumJubilee = () => {
  return (
    // The main container with the background color
    <div className="bg-[#F0F7FF] font-sans">
      {/* A single main element to hold all content with consistent horizontal padding */}
      <main className="px-6 md:px-12 lg:px-20">
        {/* --- Hero Section with Arc Cut and Floating Elements --- */}
        <section className="relative py-10 text-center">
          {/* Background Layer (without backdrop-blur-sm, as the overlay handles it) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/path/to/your/hero-background.jpg')",
            }}
          ></div>

          {/* This div creates the light blue background with opacity for the text area and acts as a base for the arc */}
          <div className="absolute inset-0 bg-[#F0F7FF] bg-opacity-80"></div>

          {/* Floating PNG - positioned absolutely within the section */}
          <motion.img
            src={floatingPngPlaceholder}
            alt="Floating Jubilee Icon"
            className="absolute z-20 left-[5%] md:left-[15%] top-[25%] w-24 h-24 md:w-70 md:h-70 object-contain"
            initial={{ opacity: 0, scale: 0.5, x: -100 }}
            animate={{ opacity: 1, scale: 1, x: [-100, 50, -50] }} // Example float animation
            transition={{ duration: 3, ease: "easeInOut" }}
          />

          {/* Floating Interactive Elements */}
          <motion.div
            className="absolute z-20 left-[5%] md:left-[10%] top-[20%] p-3 rounded-full bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: [-50, 0, -50] }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <img
              src={interactiveIcon1}
              alt="Interactive 1"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </motion.div>
          <motion.div
            className="absolute z-20 left-[20%] md:left-[35%] top-[70%] p-3 rounded-full bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: [-50, 0, -50] }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <img
              src={interactiveIcon2}
              alt="Interactive 2"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </motion.div>

          {/* Content for the Hero Section - placed on top of the arc and background */}
          <div className="relative z-10 max-w-4xl ml-[30%] flex flex-col items-center">
            <motion.h1
              className="text-4xl text-black md:text-6xl font-extrabold mb-4 pt-10" // Added padding-top to avoid clipping arc
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Celebrating Platinum Jubilee
            </motion.h1>
            <motion.div
              // Adjusted positioning to be to the right of the perceived arc
              className="text-left text-base md:text-lg space-y-3 text-black p-6 rounded-lg w-full md:w-3/4 lg:w-2/3 mx-auto pr-0" // Removed bg-opacity, added ml-auto
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <p>
                ✓ IIT Kharagpur, founded on 18th August 1951, will complete 75
                years on 18th August 2026.
              </p>
              <p>
                ✓ To mark this occasion, the Institute has decided on a two
                year-long celebration starting in August 2025 and ending in
                August 2027.
              </p>
              <p>
                ✓ This is an occasion to recall the contributions of generations
                of teachers and students who have made the Institute what it is.
              </p>
              <p>
                ✓ It is a time for nostalgia, but also a time to rededicate and
                build.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- Commemorative Events Section --- */}
        <motion.section
          className="max-w-7xl mx-auto py-5" // Adjusted padding-bottom to py-16 for separation
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center justify-center">
            {commemorativeEvents.icon}{" "}
            <span className="ml-3">{commemorativeEvents.title}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {commemorativeEvents.items.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center text-xl font-semibold mb-4">
                  {item.icon} {item.name}
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-contain rounded-md mb-4 bg-gray-100 p-2"
                />
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default PlatinumJubilee;
