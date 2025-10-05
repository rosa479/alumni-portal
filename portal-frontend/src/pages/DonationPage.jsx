// src/features/donations/DonationPage.jsx
import React, { useState } from 'react';
import { Heart } from 'react-feather';

// Pre-defined donation amounts
const amounts = [1000, 2500, 5000, 10000];
const frequencies = ['One-time', 'Monthly'];

function DonationPage() {
  const [selectedAmount, setSelectedAmount] = useState(2500);
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
    alert(`Thank you for your ${frequency.toLowerCase()} donation of ₹${finalAmount}!`);
    // In a real app, you would integrate a payment gateway here.
  };

  return (
    <div className="bg-light-bg py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Heart className="mx-auto text-primary-blue h-12 w-12 mb-4" />
            <h1 className="text-4xl font-bold text-dark-text">Support Your Alma Mater</h1>
            <p className="text-lg text-light-text mt-2">Your contribution empowers the next generation of innovators at IIT Kharagpur.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* --- Amount Selection --- */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Select an Amount (INR)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountClick(amount)}
                    className={`p-4 rounded-lg font-bold text-center transition-all ${
                      selectedAmount === amount 
                        ? 'bg-primary-blue text-white ring-2 ring-offset-2 ring-primary-blue' 
                        : 'bg-gray-100 text-dark-text hover:bg-gray-200'
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
                className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:outline-none"
              />
            </div>

            {/* --- Frequency Selection --- */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Select Frequency</h3>
              <div className="flex bg-gray-100 rounded-full p-1">
                {frequencies.map(freq => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`w-1/2 py-2 rounded-full font-semibold transition-colors ${
                      frequency === freq ? 'bg-primary-blue text-white' : 'text-light-text'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* --- Submit Button --- */}
            <button
              type="submit"
              className="w-full bg-accent-gold text-primary-blue font-bold py-4 px-6 rounded-full text-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
            >
              Proceed to Donate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DonationPage;