import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaGraduationCap,
  FaUsers,
  FaHandsHelping,
} from "react-icons/fa";
import { Users, Calendar, Briefcase, GraduationCap } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <Users className="text-5xl text-blue-500" />,
      title: "Alumni Directory",
      description:
        "Connect with over 50,000 alumni across the globe. Find classmates, colleagues, and industry leaders.",
    },
    {
      icon: <Calendar className="text-5xl text-green-500" />,
      title: "Events & Reunions",
      description:
        "Stay updated on alumni gatherings, workshops, webinars, and annual reunions happening worldwide.",
    },
    {
      icon: <Briefcase className="text-5xl text-yellow-500" />,
      title: "Career Hub",
      description:
        "Discover job opportunities, post openings, and advance your career with exclusive alumni connections.",
    },
    {
      icon: <GraduationCap className="text-5xl text-purple-500" />,
      title: "Mentorship Program",
      description:
        "Guide students and young alumni, or seek mentorship from experienced professionals in your field.",
    },
  ];

  return (
    <div id="about" className="bg-[#E6F1F9]">
      <motion.section
        className="text-[#1E2939] py-16 px-6 md:px-12 lg:px-20 bg-opacity-90"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="font-octin-sports text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Everything You Need to Stay Connected
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            kgpACT provides a comprehensive platform designed to strengthen
            the bonds of our global alumni community
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl text-center shadow-lg hover:shadow-xl transition duration-300 bg-white bg-opacity-90 backdrop-blur-lg"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.2 * index,
                  sduration: 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <motion.div
                  className="mb-4"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutSection;
