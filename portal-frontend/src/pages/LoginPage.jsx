import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../interceptor";
import { initGoogleAuth } from "../services/oauthService";
import { Handshake, Users, Network, Sparkles, GraduationCap, Star, Briefcase, Globe } from "lucide-react"; // Add more icons

// --- Reusable Components ---
const Input = ({ id, label, value, onChange, type, placeholder, className, disabled }) => (
  <div className="text-left">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5] text-gray-800 ${className} ${
        disabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F5F8FA]"
      }`}
      required
    />
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`w-full py-2 px-4 text-base font-semibold rounded-lg transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

// --- Login Page ---
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Handle OAuth redirect with pre-filled email
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setStep("password");
    }
  }, [location.state]);

  // Step 1 → Check email
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/auth/check-user/?email=${encodeURIComponent(email)}`);
      if (response.data.exists) {
        setStep("password");
      } else {
        navigate("/register", { 
          state: { 
            email: email,
            isNewUser: true 
          } 
        });
      }
    } catch (err) {
      console.warn("Email not found, going to register");
      navigate("/register", { 
        state: { 
          email: email,
          isNewUser: true 
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 → Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login/", { email, password });
      const { access, refresh, user } = response.data;

      // If alumni_profile is missing, fetch the full profile
      let fullUser = user;
      if (!user?.alumni_profile) {
        const profileRes = await apiClient.get("/profiles/me/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        fullUser = profileRes.data;
      }

      login(access, refresh, fullUser);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed, going to register");
      navigate("/register", { 
        state: { 
          email: email,
          isNewUser: true 
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full relative overflow-x-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <svg className="absolute h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,0 L 60,0 C 70,0 75,50 65,50 C 55,50 45,100 55,100 L 0,100 Z" fill="#c5deeb" className="transition-all duration-300" />
        </svg>
      </div>

      {/* Decorative large icons around the hero text */}
      <div className="absolute left-10 top-10 animate-float-slow z-0">
        <Users size={80} className="text-[#0077B5] opacity-20" />
      </div>
      <div className="absolute right-16 top-24 animate-float-slow z-0">
        <Network size={70} className="text-[#0077B5] opacity-20" />
      </div>
      <div className="absolute left-24 bottom-24 animate-float-slow z-0">
        <GraduationCap size={90} className="text-[#0077B5] opacity-20" />
      </div>
      <div className="absolute right-10 bottom-10 animate-float-slow z-0">
        <Briefcase size={75} className="text-[#0077B5] opacity-20" />
      </div>
      <div className="absolute left-1/2 top-1/2 animate-float-slow z-0" style={{ transform: "translate(-50%, -50%)" }}>
        <Globe size={100} className="text-[#0077B5] opacity-10" />
      </div>
      {/* <div className="absolute left-1/3 top-1/4 animate-float-slow z-0">
        <Star size={60} className="text-[#0077B5] opacity-10" />
      </div> */}

      <div className="flex flex-col items-start  justify-center md:w-1/2 px-8 md:px-16 lg:px-24 relative z-10">
        <div className="animate-fade-in-up max-w-md ">
          <div className="relative">
            <div className="absolute -left-12 -top-8 animate-float">
              <Handshake size={32} className="text-[#0077B5] rotate-[-15deg]" />
            </div>
            <div className="absolute -right-10 -top-6 animate-float animation-delay-150">
              <Users size={28} className="text-[#0077B5] rotate-12" />
            </div>
            <div className="absolute -left-8 bottom-0 animate-float animation-delay-300">
              <Network size={24} className="text-[#0077B5]" />
            </div>
            <div className="absolute -right-6 bottom-2 animate-float animation-delay-450">
              <Sparkles size={20} className="text-[#0077B5] rotate-[15deg]" />
            </div>

            <h1 className="hidden sm:block text-5xl md:text-6xl font-bold mb-4 text-[#0077B5]">
              AlumnIIT
            </h1>
          </div>
          <p className="hidden sm:flex justify-center items-center text-lg md:text-xl text-gray-600 font-bold">
            Connecting the Past, Empowering the Future. AlumnIIT connects IIT Kharagpur alumni, helping you reconnect, explore mentorship, and stay updated on events and achievements. Bridge generations, seek guidance, and give back to the KGP community.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center md:w-1/2 px-4 py-12 md:py-0 relative z-10">
        <div className="w-full max-w-md p-10 bg-white rounded-2xl border border-[#E3EAF3] shadow-lg text-center space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0077B5] mb-2">Welcome Back!</h2>
            <p className="text-base text-gray-500 mb-6">Sign in to your alumni account</p>
            {location.state?.message && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4">
                <p>{location.state.message}</p>
              </div>
            )}
          </div>

          {step === "email" && (
            <form onSubmit={handleEmailCheck} className="space-y-6">
              <Input
                id="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="your.email@example.com"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={`bg-[#0077B5] text-white hover:bg-[#005983] ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Checking..." : "Continue"}
              </Button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input id="email-display" label="Email Address" value={email} type="email" disabled />
              <Input
                id="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={`bg-[#0077B5] text-white hover:bg-[#005983] ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}

          {/* Google OAuth Button */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={initGoogleAuth}
              className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-[#0077B5] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;