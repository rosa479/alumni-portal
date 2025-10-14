// src/pages/DonationPage.jsx
import React, { useState } from 'react';
import { Heart, Home, Book } from 'react-feather';

// Pre-defined donation amounts for institute donations
const amounts = [1000, 2500, 5000, 10000, 25000, 50000, 100000, 1000000];
const frequencies = ['One-time', 'Monthly', 'Yearly'];

function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('One-time');

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(''); // Clear custom amount when a preset is chosen
  };

  const handleCustomAmountChange = (e) => {
    setSelectedAmount(null); // Deselect presets when typing a custom amount
    setCustomAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = customAmount || selectedAmount;
    alert(`Thank you for your ${frequency.toLowerCase()} donation of ₹${finalAmount} to IIT Kharagpur!`);
    // In a real app, you would integrate a payment gateway here.
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-[#E3F0FB] to-orange-50 py-12 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* IIT Kharagpur Header */}
        <div className="text-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#0077B5] mb-4">Indian Institute of Technology Kharagpur</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Support the growth and development of your alma mater. Your endowment help IIT Kharagpur
            maintain its excellence in education, research, and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-10 border border-gray-100">
              <h3 className="text-3xl font-bold text-[#0077B5] mb-8 text-center">Make a Donation to IIT Kharagpur</h3>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount Selection */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-[#0077B5]">Select Donation Amount (INR)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {amounts.map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountClick(amount)}
                        className={`p-3 rounded-xl font-bold text-center transition-all transform hover:scale-105 ${selectedAmount === amount
                          ? 'bg-gradient-to-br from-[#0077B5] to-[#005983] text-white ring-4 ring-offset-2 scale-105'
                          : 'bg-white text-[#0077B5] hover:bg-gradient-to-br hover:from-[#0077B5] hover:to-[#005983] hover:text-white border-2 border-[#E3EAF3] hover:border-[#0077B5]'
                          }`}
                      >
                        ₹{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Or enter a custom amount"
                    className="w-full p-3 border border-[#E3EAF3] rounded-lg focus:ring-2 focus:ring-[#0077B5] focus:outline-none"
                  />
                </div>

                {/* Frequency Selection */}
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-[#0077B5]">Donation Frequency</h4>
                  <div className="flex bg-[#F5F8FA] rounded-full p-1">
                    {frequencies.map(freq => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        className={`w-1/3 py-3 rounded-full font-semibold transition-all duration-300 ${frequency === freq
                          ? 'bg-[#0077B5] text-white scale-105'
                          : 'text-[#0077B5] hover:bg-white'
                          }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={() => alert('Coming Soon!')}
                  className="w-full bg-orange-600 text-white font-bold py-4 px-6 rounded-full text-lg hover:bg-orange-700 transition-all transform hover:-translate-y-0.5"
                >
                  Proceed to Donate
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 mb-6 border border-[#E3EAF3]">
              <h4 className="text-xl font-bold text-[#0077B5] mb-4">How Your Donation Helps</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Book className="h-6 w-6 text-[#0077B5] mr-3 mt-1" />
                  <div>
                    <h5 className="font-semibold text-dark-text">Student Support</h5>
                    <p className="text-sm text-light-text">Scholarships and financial aid for deserving students</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Home className="h-6 w-6 text-iit-orange mr-3 mt-1" />
                  <div>
                    <h5 className="font-semibold text-dark-text">Infrastructure</h5>
                    <p className="text-sm text-light-text">Modern facilities and research equipment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-6 w-6 text-red-500 mr-3 mt-1" />
                  <div>
                    <h5 className="font-semibold text-dark-text">Research</h5>
                    <p className="text-sm text-light-text">Cutting-edge research and innovation projects</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#E3EAF3]">
              <h4 className="text-xl font-bold text-[#0077B5] mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-[#0077B5]" />
                IIT Kharagpur Impact
              </h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="flex items-center">
                    <Book className="w-4 h-4 mr-2 text-[#0077B5]" />
                    Students
                  </span>
                  <span className="font-bold text-lg">15,000+</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="flex items-center">
                    <Home className="w-4 h-4 mr-2 text-iit-orange" />
                    Faculty
                  </span>
                  <span className="font-bold text-lg">750+</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/20">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-[#0077B5]" />
                    Research Projects
                  </span>
                  <span className="font-bold text-lg">1,330+</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="flex items-center">
                    <Home className="w-4 h-4 mr-2 text-iit-orange" />
                    Alumni Worldwide
                  </span>
                  <span className="font-bold text-lg">50,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default DonationPage;