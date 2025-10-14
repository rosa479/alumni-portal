import React from "react";
import { motion } from "framer-motion";
import { Award, Stamp, Coins } from "lucide-react";
import stampsImage from "../../assets/platinum/stamps.png";
import coinImage from "../../assets/platinum/coins.png";

// Placeholder images
import floatingPngPlaceholder from "../../assets/platinum/logo-1.png";
import interactiveIcon1 from "../../assets/platinum/logo-1.png";
import interactiveIcon2 from "../../assets/platinum/logo-1.png";

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
    <div className="bg-[#F0F7FF] font-sans">
      <main className="px-6 md:px-12 lg:px-20">
        {/* --- Hero Section --- */}
        <section className="relative pt-10 pb-5 text-center">
          {/* Background Layer */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/path/to/your/hero-background.jpg')",
            }}
          ></div>

          {/* Background Overlay */}
          <div className="absolute inset-0 bg-[#F0F7FF] bg-opacity-80"></div>

          <div className="relative md:flex md:items-center md:justify-start">
            {/* On desktop, it takes up ~30% of the width. */}
            <div className="md:w-[30%] md:h-full md:relative">
              {/* Floating PNG */}
              <motion.img
                src={floatingPngPlaceholder}
                alt="Floating Jubilee Icon"
                // Mobile: Centered, relative positioning. Desktop: Absolute positioning.
                className="relative mx-auto mb-8 w-32 h-32 md:mx-0 md:mb-0 z-20 md:left-[35%] md:top-[10%] md:w-70 md:h-70 object-contain"
                initial={{ opacity: 0, scale: 0.5, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Floating Interactive Elements - HIDDEN on mobile
              <motion.div className="hidden md:block absolute z-20 left-[10%] top-[20%] p-3 rounded-full bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
                <img
                  src={interactiveIcon1}
                  alt="Interactive 1"
                  className="w-10 h-10 object-contain"
                />
              </motion.div>
              <motion.div className="hidden md:block absolute z-20 left-[35%] top-[70%] p-3 rounded-full bg-white shadow-lg cursor-pointer hover:scale-110">
                <img
                  src={interactiveIcon2}
                  alt="Interactive 2"
                  className="w-10 h-10 object-contain"
                />
              </motion.div> */}
            </div>

            {/* --- RIGHT SIDE (Text Content) --- */}
            {/* On mobile, this takes full width. On desktop, it takes the remaining width. */}
            <div className="relative z-10 md:w-[70%] flex flex-col items-center md:items-start">
              <motion.h1
                className="text-4xl text-black md:text-6xl font-extrabold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Celebrating Platinum Jubilee
              </motion.h1>
              <motion.div
                className="text-left text-base md:text-lg md:mx-auto space-y-3 text-black p-6 rounded-lg w-full max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <p>
                  ✓ IIT Kharagpur, founded on 18th August 1951, will complete 75
                  years on 18th August 2026.
                </p>
                <p className="hidden md:block">
                  ✓ To mark this occasion, the Institute has decided on a two
                  year-long celebration starting in August 2025 and ending in
                  August 2027.
                </p>
                <p className="hidden md:block">
                  ✓ This is an occasion to recall the contributions of
                  generations of teachers and students who have made the
                  Institute what it is.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Commemorative Events Section --- */}
        <motion.section
          className="max-w-7xl mx-auto pb-10"
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
