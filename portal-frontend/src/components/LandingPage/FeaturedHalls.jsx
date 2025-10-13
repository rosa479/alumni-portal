import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { halls } from "../../assets/hall.js"; // Adjust this import path if your file is located elsewhere

const AnimatedBackground = React.memo(() => {
  return (
    <div className="absolute inset-0 bg-white" /> // This is the only line needed
  );
});

const HallCard = React.memo(
  ({ hall, index, activeIndex, onClick, totalHalls }) => {
    const offset = useMemo(() => {
      const diff = index - activeIndex;
      if (Math.abs(diff) > totalHalls / 2) {
        return diff > 0 ? diff - totalHalls : diff + totalHalls;
      }
      return diff;
    }, [index, activeIndex, totalHalls]);

    const isVisible = Math.abs(offset) <= 2;

    const cardStyle = useMemo(() => {
      if (!isVisible) {
        const direction = offset > 0 ? 1 : -1;
        return {
          opacity: 0,
          scale: 0.5,
          filter: "blur(10px)",
          transform: `translateX(${direction * 150}%) scale(0.5)`,
          zIndex: 0,
        };
      }

      const distance = Math.abs(offset);
      const scale = distance === 0 ? 1 : 0.85;
      const opacity = distance === 0 ? 1 : distance === 1 ? 0.9 : 0.5;
      const filter = distance > 1 ? "blur(2px)" : "blur(0px)";
      const zIndex = 10 - distance;

      return {
        transform: `translateX(${offset * 70}%) scale(${scale})`,
        opacity,
        filter,
        zIndex,
      };
    }, [offset, isVisible]);

    return (
      <motion.div
        className="absolute cursor-pointer w-72 h-72"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={cardStyle}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        onClick={onClick}
      >
        <div
          className={`relative w-full h-full rounded-2xl overflow-hidden bg-white ${
            offset === 0
              ? "shadow-2xl ring-2 ring-offset-2 ring-[#0077B5]"
              : "shadow-xl"
          } transition-all duration-300`}
        >
          <img
            src={hall.image}
            alt={hall.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3
              className="text-2xl font-bold text-white"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
            >
              {hall.name}
            </h3>
          </div>
        </div>
      </motion.div>
    );
  }
);
HallCard.displayName = "HallCard";

const FeaturedHalls = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % halls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoRotating, halls.length]);

  const nextHall = useCallback(() => {
    setIsAutoRotating(false);
    setActiveIndex((prev) => (prev + 1) % halls.length);
    setTimeout(() => setIsAutoRotating(true), 8000);
  }, [halls.length]);

  const prevHall = useCallback(() => {
    setIsAutoRotating(false);
    setActiveIndex((prev) => (prev - 1 + halls.length) % halls.length);
    setTimeout(() => setIsAutoRotating(true), 8000);
  }, [halls.length]);

  const selectHall = useCallback((index) => {
    setIsAutoRotating(false);
    setActiveIndex(index);
    setTimeout(() => setIsAutoRotating(true), 8000);
  }, []);

  return (
    <section className="relative overflow-hidden ">
      <AnimatedBackground />
      <div className="bg-[#E6F1F9] relative z-10 container mx-auto px-4 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Halls of Residence
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A glimpse into the legendary halls that have been home to
            generations of KGPians.
          </p>
        </motion.div>

        <div className="relative h-[300px] flex items-center justify-center">
          {halls.map((hall, index) => (
            <HallCard
              key={hall.id}
              hall={hall}
              index={index}
              activeIndex={activeIndex}
              onClick={() => selectHall(index)}
              totalHalls={halls.length}
            />
          ))}
        </div>

        <div className="flex justify-center items-center space-x-6 mt-12">
          <button
            onClick={prevHall}
            className="p-3 bg-white hover:bg-gray-100 rounded-full text-gray-600 hover:text-[#0077B5] transition-all duration-200 border border-gray-300 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex space-x-2">
            {halls.map((_, index) => (
              <button
                key={index}
                onClick={() => selectHall(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-[#0077B5] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextHall}
            className="p-3 bg-white hover:bg-gray-100 rounded-full text-gray-600 hover:text-[#0077B5] transition-all duration-200 border border-gray-300 shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHalls;
