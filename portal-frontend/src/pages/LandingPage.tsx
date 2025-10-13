import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Globe,
  Award,
  Heart,
} from "lucide-react";
import { CountUp } from "countup.js";
import iitkgpDrone from "../assets/dist_iitkgpvideo1.webm";
import AboutSection from "../components/LandingPage/HomeFeatures";
import FeaturedHalls from "../components/LandingPage/FeaturedHalls";

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "hero" | "secondary";
  size?: "default" | "lg";
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-[hsl(199,89%,48%)] text-white hover:bg-[hsl(199,89%,40%)]",
      outline:
        "border border-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,48%)]/10",
      hero: "bg-[hsl(199,89%,48%)] text-white hover:bg-[hsl(197,71%,73%)] shadow-[0_0_40px_hsl(197,71%,73%,0.4)] hover:shadow-[0_0_40px_hsl(197,71%,73%,0.4)]",
      secondary: "bg-white text-[hsl(199,89%,48%)] hover:bg-white/90",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      lg: "h-12 px-8 py-3 text-lg",
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        className: `${classes} ${children.props.className || ""}`,
      } as any);
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Inline Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-[hsl(214,32%,91%)] bg-white text-[hsl(222,47%,11%)] shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const Navbar = () => {
  return (
    <header className="bg-[#FFFFFF70] shadow-sm fixed top-5 z-50 backdrop-blur-xl rounded-full w-[95%] left-1/2 -translate-x-1/2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Corner: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold text-foreground">
              alumn<span className="text-primary">IIT</span>
            </Link>
          </div>

          {/* Center Options - Hidden on mobile, visible on medium screens and up */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/directory"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Directory
              </Link>
              <Link
                to="/events"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Events
              </Link>
              <Link
                to="/jobs"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Career Hub
              </Link>
              <Link
                to="/mentorship"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                Mentorship
              </Link>
              <Link
                to="/news"
                className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                News
              </Link>
            </div>
          </div>

          {/* Right End: Authentication - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="bg-[#FFFFFF0] ml-4 flex items-center md:ml-6 gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button - Hidden on medium screens and up */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

const HeroSection = () => {
  // 1. Create refs for each element you want to animate
  const membersRef = useRef(null);
  const countriesRef = useRef(null);
  const companiesRef = useRef(null);

  useEffect(() => {
    // 2. Create and start the CountUp instances inside useEffect
    // This ensures it runs only once after the component mounts

    // Animate Members
    if (membersRef.current) {
      const membersCountUp = new CountUp(membersRef.current, 50000, {
        duration: 3,
        suffix: "+",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!membersCountUp.error) {
        membersCountUp.start();
      } else {
        console.error(membersCountUp.error);
      }
    }

    // Animate Countries
    if (countriesRef.current) {
      const countriesCountUp = new CountUp(countriesRef.current, 150, {
        duration: 3,
        suffix: "+",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!countriesCountUp.error) {
        countriesCountUp.start();
      } else {
        console.error(countriesCountUp.error);
      }
    }

    // Animate Companies
    if (companiesRef.current) {
      const companiesCountUp = new CountUp(companiesRef.current, 2000, {
        duration: 3,
        suffix: "+",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!companiesCountUp.error) {
        companiesCountUp.start();
      } else {
        console.error(companiesCountUp.error);
      }
    }
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <section className="w-dvw h-dvh relative overflow-hidden flex items-center">
      {/* Video Background and Overlay */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          {/* --- IMPORTANT --- */}
          {/* Replace this src with the path to your video file */}
          <source src={iitkgpDrone} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* This overlay improves text readability over the video */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl md:ml-40 px-4 sm:px-6 lg:px-8">
        {/* The content now lives in a single, width-constrained container */}
        <div className="max-w-3xl">
          <div className="space-y-8 ">
            {/* Text colors are updated for better contrast */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
              Welcome to the IIT Kharagpur Community
            </h1>
            <h1 className="text-4xl md:text-3xl font-bold leading-tight text-white">
              Connect. Collaborate.
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Join thousands of IIT Kharagpur alumni worldwide. Network with
              fellow graduates, mentor the next generation, and unlock
              opportunities that shape the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">Join the Network</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/directory">Explore Directory</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <div
                  ref={membersRef}
                  className="text-3xl font-bold text-gray-300"
                >
                  50,000+
                </div>
                <div className="text-sm text-gray-400">Alumni Members</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div
                  ref={countriesRef}
                  className="text-3xl font-bold text-gray-300"
                >
                  150+
                </div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div>
                <div
                  ref={companiesRef}
                  className="text-3xl font-bold text-gray-300"
                >
                  2000+
                </div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ImpactSection = () => {
  // 1. Create refs for each element you want to animate
  const trendUpRef = useRef(null);
  const globeRef = useRef(null);
  const awardRef = useRef(null);
  const contributionsRef = useRef(null);

  const stats = [
    {
      icon: TrendingUp,
      value: "95%",
      label: "Career Advancement",
      description: "Alumni report career growth through network",
      ref: trendUpRef,
    },
    {
      icon: Globe,
      value: "150+",
      label: "Global Chapters",
      description: "Active alumni chapters worldwide",
      ref: globeRef,
    },
    {
      icon: Award,
      value: "5000+",
      label: "Success Stories",
      description: "Alumni achievements celebrated",
      ref: awardRef,
    },
    {
      icon: Heart,
      value: "₹50Cr+",
      label: "Giving Back",
      description: "Contributions to alma mater",
      ref: contributionsRef,
    },
  ];

  useEffect(() => {
    if (trendUpRef.current) {
      const membersCountUp = new CountUp(trendUpRef.current, 95, {
        duration: 3,
        suffix: "%",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!membersCountUp.error) {
        membersCountUp.start();
      } else {
        console.error(membersCountUp.error);
      }
    }

    if (globeRef.current) {
      const countriesCountUp = new CountUp(globeRef.current, 150, {
        duration: 3,
        suffix: "+",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!countriesCountUp.error) {
        countriesCountUp.start();
      } else {
        console.error(countriesCountUp.error);
      }
    }

    if (awardRef.current) {
      const companiesCountUp = new CountUp(awardRef.current, 5000, {
        duration: 3,
        suffix: "+",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!companiesCountUp.error) {
        companiesCountUp.start();
      } else {
        console.error(companiesCountUp.error);
      }
    }

    if (contributionsRef.current) {
      const membersCountUp = new CountUp(contributionsRef.current, 50, {
        duration: 3,
        prefix: "₹",
        suffix: "Cr+",
        enableScrollSpy: true,
        scrollSpyDelay: 200,
      });
      if (!membersCountUp.error) {
        membersCountUp.start();
      } else {
        console.error(membersCountUp.error);
      }
    }
  }, []);

  return (
    <section className="py-20 bg-[#F0F7FF] from-primary/5 via-secondary/20 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Making a Difference Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our alumni network creates lasting impact through collaboration,
            mentorship, and giving back
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <stat.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <div
                ref={stat.ref}
                className="text-4xl font-bold text-primary mb-2"
              >
                {stat.value}
              </div>
              <div className="text-lg font-semibold mb-1">{stat.label}</div>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-[#F0F7FF] bg-gradient-to-r from-primary via-primary to-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
          Ready to Reconnect with Your Alma Mater?
        </h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Join AlumnIIT today and become part of a thriving global community of
          IIT Kharagpur graduates making waves across industries.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-primary font-semibold"
          >
            <Link to="/register">Create Your Profile</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div>
            <Link
              to="/"
              className="text-3xl font-bold text-white inline-block mb-4"
            >
              alumn<span className="text-primary">IIT</span>
            </Link>
            <p className="mb-4">
              Connecting IIT Kharagpur alumni across the globe. Building
              networks, creating opportunities, fostering excellence.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="transition-all duration-300 hover:text-[hsl(199,89%,40%)] hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="transition-all duration-300 hover:text-[hsl(199,89%,40%)] hover:scale-110"
                aria-label="Twitter"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="transition-all duration-300 hover:text-[hsl(199,89%,40%)] hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/directory"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  News & Updates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mentorship"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Mentorship
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Career Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Give Back
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="relative transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-[hsl(199,89%,40%)] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Map */}
          <div>
            <h3 className="font-semibold text-white mb-4">Visit Us</h3>
            <div className="overflow-hidden rounded-lg">
              {/* Note: I've replaced your broken iframe src with a working one for IIT Kharagpur. 
                  The `frameborder` attribute is obsolete; styling is better handled with CSS (e.g., style={{ border: 0 }}). */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.426362947233!2d87.30843231540547!3d22.33777498530188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1d44158c345555%3A0x8a299b136932a32!2sIndian%20Institute%20of%20Technology%20Kharagpur!5e0!3m2!1sen!2sin!4v1671887333933!5m2!1sen!2sin"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>
            © {new Date().getFullYear()} AlumnIIT - IIT Kharagpur Alumni
            Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <HeroSection />
      <AboutSection />
      <ImpactSection />
      <FeaturedHalls />
      <CTASection />
      <Footer />
    </>
  );
}

export default LandingPage;
