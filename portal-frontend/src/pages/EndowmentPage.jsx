import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Users, Calendar, Target, TrendingUp } from 'react-feather';
import apiClient from '../interceptor';

function ContributionCard({ contribution }) {
   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      });
   };

   const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
         style: 'currency',
         currency: 'INR',
         maximumFractionDigits: 0
      }).format(amount);
   };

   return (
      <div className="bg-white rounded-xl overflow-hidden transition-shadow duration-300">
         {contribution.image_url && (
            <div className="h-48 overflow-hidden">
               <img
                  src={contribution.image_url}
                  alt={contribution.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
               />
            </div>
         )}

         <div className="p-6">
            <div className="flex items-start justify-between mb-4">
               <h3 className="text-xl font-bold text-dark-text line-clamp-2">{contribution.title}</h3>
               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contribution.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {contribution.status}
               </span>
            </div>

            <p className="text-light-text text-sm mb-4 line-clamp-3">{contribution.description}</p>

            {contribution.target_amount && parseFloat(contribution.target_amount) > 0 && (
               <div className="mb-4">
                  <div className="flex justify-between text-sm text-light-text mb-2">
                     <span>Progress</span>
                     <span>{contribution.progress_percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                     <div
                        className="bg-[#0077B5] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${contribution.progress_percentage}%` }}
                     ></div>
                  </div>
               </div>
            )}

            {(contribution.target_amount && parseFloat(contribution.target_amount) > 0) || 
             (contribution.current_amount && parseFloat(contribution.current_amount) > 0) ? (
               <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {contribution.target_amount && parseFloat(contribution.target_amount) > 0 && (
                     <div className="flex items-center text-light-text">
                        <Target className="w-4 h-4 mr-2 text-[#0077B5]" />
                        <span>Target: {formatCurrency(contribution.target_amount)}</span>
                     </div>
                  )}
                  {contribution.current_amount && parseFloat(contribution.current_amount) > 0 && (
                     <div className="flex items-center text-light-text">
                        <TrendingUp className="w-4 h-4 mr-2 text-[#0077B5]" />
                        <span>Raised: {formatCurrency(contribution.current_amount)}</span>
                     </div>
                  )}
               </div>
            ) : null}

            <div className="flex items-center justify-between text-sm text-light-text mb-4">
               {contribution.contribution_count > 0 ? (
                  <div className="flex items-center">
                     <Users className="w-4 h-4 mr-2 text-[#0077B5]" />
                     <span>{contribution.contribution_count} contributors</span>
                  </div>
               ) : (
                  <div></div>
               )}
               <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#0077B5]" />
                  <span>{formatDate(contribution.created_at)}</span>
               </div>
            </div>

            <div className="flex items-center justify-between">
               {contribution.created_by_name ? (
                  <div className="text-sm">
                     <span className="text-light-text">Created by </span>
                     <span className="font-semibold text-dark-text">{contribution.created_by_name}</span>
                  </div>
               ) : (
                  <div></div>
               )}
               <Link
                  to={`/endowment/${contribution.id}`}
                  className="bg-[#0077B5] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
               >
                  View Details
               </Link>
            </div>
         </div>
      </div>
   );
}

function EndowmentPage() {
   const [endowment, setEndowment] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState('all');
   const [totals, setTotals] = useState({
      total_raised: 0,
      total_contributors: 0,
      total_scholarships: 0
   });

   useEffect(() => {
      const fetchEndowment = async () => {
         try {
            setLoading(true);
            const response = await apiClient.get('/scholarships/');
            setEndowment(response.data.results || response.data);
            setTotals({
               total_raised: response.data.total_raised || 0,
               total_contributors: response.data.total_contributors || 0,
               total_scholarships: response.data.total_scholarships || 0
            });
         } catch (error) {
            console.error('Error fetching endowment:', error);
            // Fallback to empty array on error
            setEndowment([]);
            setTotals({ total_raised: 0, total_contributors: 0, total_scholarships: 0 });
         } finally {
            setLoading(false);
         }
      };

      fetchEndowment();
   }, []);

   const filteredEndowment = endowment.filter(contribution => {
      if (filter === 'all') return true;
      return contribution.status === filter;
   });

   // Remove the full page loader - we'll show individual card loaders instead

   return (
      <div className="min-h-screen bg-light-bg py-8">
         <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
               <div className="flex justify-center mb-4">
                  <CreditCard className="h-16 w-16 text-[#0077B5]" />
               </div>
               <h1 className="text-4xl font-bold text-dark-text mb-4">Contribution Programs</h1>
               <p className="text-lg text-light-text max-w-2xl mx-auto">
                  Support the next generation of innovators and leaders. Your endowment help students
                  achieve their academic dreams at IIT Kharagpur.
               </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
               <div className="bg-gray-100 rounded-full p-1">
                  <button
                     onClick={() => setFilter('all')}
                     className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'all'
                        ? 'bg-[#0077B5] text-white'
                        : 'text-gray-600 hover:text-[#0077B5] hover:bg-white'
                        }`}
                  >
                     All Endowment
                  </button>
                  <button
                     onClick={() => setFilter('ACTIVE')}
                     className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'ACTIVE'
                        ? 'bg-[#0077B5] text-white'
                        : 'text-gray-600 hover:text-[#0077B5] hover:bg-white'
                        }`}
                  >
                     Active
                  </button>
                  <button
                     onClick={() => setFilter('COMPLETED')}
                     className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'COMPLETED'
                        ? 'bg-[#0077B5] text-white'
                        : 'text-gray-600 hover:text-[#0077B5] hover:bg-white'
                        }`}
                  >
                     Completed
                  </button>
               </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center">
                     <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <Target className="h-6 w-6 text-[#0077B5]" />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-dark-text">
                           {totals.total_scholarships}
                        </p>
                        <p className="text-light-text">Total Endowment</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center">
                     <div className="p-3 bg-green-100 rounded-lg mr-4">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-dark-text">
                           ₹{totals.total_raised.toLocaleString('en-IN')}
                        </p>
                        <p className="text-light-text">Total Raised</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center">
                     <div className="p-3 bg-purple-100 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-purple-600" />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-dark-text">
                           {totals.total_contributors}
                        </p>
                        <p className="text-light-text">Total Contributors</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Endowment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {loading ? (
                  // Show loading cards
                  Array.from({ length: 6 }).map((_, index) => (
                     <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                           <div className="h-6 bg-gray-200 rounded mb-4"></div>
                           <div className="h-4 bg-gray-200 rounded mb-2"></div>
                           <div className="h-4 bg-gray-200 rounded mb-4"></div>
                           <div className="h-2 bg-gray-200 rounded mb-4"></div>
                           <div className="flex justify-between">
                              <div className="h-4 bg-gray-200 rounded w-20"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  filteredEndowment.map(contribution => (
                     <ContributionCard key={contribution.id} contribution={contribution} />
                  ))
               )}
            </div>

            {!loading && filteredEndowment.length === 0 && (
               <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No endowment found</h3>
                  <p className="text-gray-400">Try adjusting your filter or check back later.</p>
               </div>
            )}
         </div>
      </div>
   );
}

export default EndowmentPage;
