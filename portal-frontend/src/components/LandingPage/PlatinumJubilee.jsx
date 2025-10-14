// /src/components/PlatinumJubilee.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BookOpen,
  Users,
  Award,
  ChevronDown,
  Gift,
  Stamp,
  Coins,
  Megaphone,
  FlaskConical,
} from "lucide-react";
import stampsImage from "../../assets/platinum/stamps.png";
import coinImage from "../../assets/platinum/coins.png";

// --- Data for the component ---
// It's good practice to keep data separate for easier updates.

const academicEvents = {
  title: "Academic",
  icon: <FlaskConical className="w-8 h-8 text-indigo-500" />,
  mainEvents: [
    "Platinum Jubilee Product Development Challenge: To encourage commercialization of 5 products by institute researchers that can be of broad use to the community.",
    "Platinum Jubilee Institute Lecture Series: Invite distinguished visitors from India and abroad to speak on topics of wide research interest.",
  ],
  symposiumTitle:
    "Platinum Jubilee International Symposiums in five Interdisciplinary areas",
  symposiums: [
    {
      category: "Electrical Sciences",
      items: [
        {
          symposium: "Electrical Sciences-I",
          name: "Towards sustainable future through renewable energy and E-mobility: Challenges, Solutions & Opportunities",
          dates: "May 17-26, 2026 / December 11-20, 2026, Kharagpur",
          convener: "Prof. Dipankar Debnath",
        },
        {
          symposium: "Electrical Sciences II",
          name: "Responsible AI in the age of innovation",
          dates: "August 2026, Kharagpur",
          convener: "Prof. Animesh Mukherjee",
        },
        {
          symposium: "Electrical Sciences III",
          name: "Intelligent Information Systems in the Era of AI and Big Data",
          dates: "January 9-10, 2026, Kharagpur",
          convener: "Prof. Subhadip Mukherjee",
        },
      ],
    },
    { category: "Mechanical Sciences", items: [] /* Add items here */ },
    { category: "Bio Sciences", items: [] /* Add items here */ },
    { category: "Natural Sciences", items: [] /* Add items here */ },
    { category: "Social Sciences", items: [] /* Add items here */ },
  ],
};

const outreachEvents = {
  title: "Outreach",
  icon: <Megaphone className="w-8 h-8 text-green-500" />,
  items: [
    "Platinum Jubilee CSR Fund to support various welfare initiatives and minor development activities through NSS etc.",
    "Platinum Jubilee International Mobility Fund for students to fund travel for the Semester Away Programme for UG students as well as travel grants for PG and Research Scholars.",
    "Platinum Jubilee Welfare Fund to assist staff and faculty with payment of medical bills where bills far exceed reimbursable amount.",
    "Platinum Jubilee Scholarship Fund for post doctoral fellowships and internships.",
    "Platinum Jubilee UG/PG Teaching Laboratory Fund for upgradation of UG and PG Teaching Laboratories.",
  ],
};

const celebratoryEvents = {
  title: "Celebratory",
  icon: <Gift className="w-8 h-8 text-red-500" />,
  items: [
    "Curtain Raiser and Cultural Programme on 18 August 2025",
    "Folk Music Festival – January - February 2026",
    "Spic Macay International Convention – May 2026",
  ],
};

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
      // TODO: Replace with your actual image path
      image: coinImage,
      description: "A special ₹75 coin minted to mark this historic occasion.",
    },
  ],
};

// --- Accordion Component ---
const Accordion = ({ category, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <span className="font-semibold">{category}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50">
              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Symposium
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates & Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lead Convener
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.symposium}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-600">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.dates}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.convener}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Details coming soon...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Platinum Jubilee Component ---
const PlatinumJubilee = () => {
  const [activeTab, setActiveTab] = useState("events");

  const tabs = [
    { id: "events", label: "Events and Programmes", icon: <Calendar /> },
    { id: "infra", label: "Infrastructure Development", icon: <BookOpen /> },
    { id: "alumni", label: "Alumni Initiatives", icon: <Users /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "events":
        return (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Celebratory Events */}
            <section>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                {celebratoryEvents.icon}{" "}
                <span className="ml-3">{celebratoryEvents.title}</span>
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-600">
                {celebratoryEvents.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Commemorative Events */}
            <section>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                {commemorativeEvents.icon}{" "}
                <span className="ml-3">{commemorativeEvents.title}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {commemorativeEvents.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center text-xl font-semibold mb-4">
                      {item.icon} {item.name}
                    </div>
                    {/* TODO: Update this img src with the correct path */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-contain rounded-md mb-4 bg-gray-100 p-2"
                    />
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Academic Events */}
            <section>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                {academicEvents.icon}{" "}
                <span className="ml-3">{academicEvents.title}</span>
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-600 mb-8">
                {academicEvents.mainEvents.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <h4 className="text-2xl font-semibold mb-4 text-gray-700">
                {academicEvents.symposiumTitle}
              </h4>
              <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {academicEvents.symposiums.map((symposium) => (
                  <Accordion
                    key={symposium.category}
                    category={symposium.category}
                    items={symposium.items}
                  />
                ))}
              </div>
            </section>

            {/* Outreach Events */}
            <section>
              <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
                {outreachEvents.icon}{" "}
                <span className="ml-3">{outreachEvents.title}</span>
              </h3>
              <ul className="space-y-3 list-disc list-inside text-gray-600">
                {outreachEvents.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          </motion.div>
        );
      case "infra":
        return (
          <div key="infra" className="text-center text-gray-500 py-16">
            Content for Infrastructure Development coming soon...
          </div>
        );
      case "alumni":
        return (
          <div key="alumni" className="text-center text-gray-500 py-16">
            Content for Alumni Initiatives coming soon...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F0F7FF] font-sans">
      {/* --- Hero Section --- */}
      <section className="relative text-white py-20 px-6 md:px-12 lg:px-20 text-center overflow-hidden">
        {/* TODO: Replace with your actual background image */}
        <div
          className="absolute inset-0 bg-[#E6F1F9] bg-opacity-80 backdrop-blur-sm"
          style={{
            backgroundImage: "url('/path/to/your/hero-background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl text-black md:text-6xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Celebrating Platinum Jubilee
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl font-semibold bg-yellow-400 text-blue-900 px-4 py-2 rounded-full inline-block mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            August 18, 2025 - August 18, 2027
          </motion.p>
          <motion.div
            className="text-left text-base md:text-lg space-y-3 bg-black bg-opacity-30 p-6 rounded-lg"
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
              year-long celebration starting in August 2025 and ending in August
              2027.
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

      {/* --- Tabs & Content Section --- */}
      <main className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="mb-12 border-b border-gray-300 flex justify-center space-x-2 md:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 text-sm md:text-lg font-semibold py-4 px-1 md:px-4 transition-colors duration-300 ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PlatinumJubilee;
