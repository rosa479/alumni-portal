import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Users, Calendar, Target, TrendingUp } from 'react-feather';

// Mock data for now - will be replaced with API calls
const mockScholarships = [
   {
      id: '1',
      title: 'Merit Scholarship for Computer Science',
      description: 'Supporting outstanding students in Computer Science and Engineering with financial assistance for their academic journey.',
      target_amount: 500000,
      current_amount: 250000,
      progress_percentage: 50,
      remaining_amount: 250000,
      created_by_name: 'Dr. Rajesh Kumar',
      created_at: '2024-01-15T10:00:00Z',
      image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      contribution_count: 15,
      status: 'ACTIVE'
   },
   {
      id: '2',
      title: 'Women in Engineering Scholarship',
      description: 'Encouraging and supporting female students pursuing engineering degrees at IIT Kharagpur.',
      target_amount: 300000,
      current_amount: 180000,
      progress_percentage: 60,
      remaining_amount: 120000,
      created_by_name: 'Prof. Priya Sharma',
      created_at: '2024-02-01T14:30:00Z',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
      contribution_count: 8,
      status: 'ACTIVE'
   },
   {
      id: '3',
      title: 'Research Excellence Fellowship',
      description: 'Supporting graduate students conducting cutting-edge research in various engineering disciplines.',
      target_amount: 750000,
      current_amount: 450000,
      progress_percentage: 60,
      remaining_amount: 300000,
      created_by_name: 'Dr. Amit Verma',
      created_at: '2024-01-20T09:15:00Z',
      image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
      contribution_count: 22,
      status: 'ACTIVE'
   }
];

function ScholarshipCard({ scholarship }) {
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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
         {scholarship.image_url && (
            <div className="h-48 overflow-hidden">
               <img
                  src={scholarship.image_url}
                  alt={scholarship.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
               />
            </div>
         )}

         <div className="p-6">
            <div className="flex items-start justify-between mb-4">
               <h3 className="text-xl font-bold text-dark-text line-clamp-2">{scholarship.title}</h3>
               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${scholarship.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {scholarship.status}
               </span>
            </div>

            <p className="text-light-text text-sm mb-4 line-clamp-3">{scholarship.description}</p>

            <div className="mb-4">
               <div className="flex justify-between text-sm text-light-text mb-2">
                  <span>Progress</span>
                  <span>{scholarship.progress_percentage.toFixed(1)}%</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                     className="bg-blue-800 h-2 rounded-full transition-all duration-500"
                     style={{ width: `${scholarship.progress_percentage}%` }}
                  ></div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
               <div className="flex items-center text-light-text">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Target: {formatCurrency(scholarship.target_amount)}</span>
               </div>
               <div className="flex items-center text-light-text">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Raised: {formatCurrency(scholarship.current_amount)}</span>
               </div>
            </div>

            <div className="flex items-center justify-between text-sm text-light-text mb-4">
               <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{scholarship.contribution_count} contributors</span>
               </div>
               <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(scholarship.created_at)}</span>
               </div>
            </div>

            <div className="flex items-center justify-between">
               <div className="text-sm">
                  <span className="text-light-text">Created by </span>
                  <span className="font-semibold text-dark-text">{scholarship.created_by_name}</span>
               </div>
               <Link
                  to={`/scholarships/${scholarship.id}`}
                  className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium"
               >
                  View Details
               </Link>
            </div>
         </div>
      </div>
   );
}

function ScholarshipsPage() {
   const [scholarships, setScholarships] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState('all');

   useEffect(() => {
      // Simulate API call
      setTimeout(() => {
         setScholarships(mockScholarships);
         setLoading(false);
      }, 1000);
   }, []);

   const filteredScholarships = scholarships.filter(scholarship => {
      if (filter === 'all') return true;
      return scholarship.status === filter;
   });

   // Remove the full page loader - we'll show individual card loaders instead

   return (
      <div className="min-h-screen bg-light-bg py-8">
         <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
               <div className="flex justify-center mb-4">
                  <CreditCard className="h-16 w-16 text-blue-800" />
               </div>
               <h1 className="text-4xl font-bold text-dark-text mb-4">Scholarship Programs</h1>
               <p className="text-lg text-light-text max-w-2xl mx-auto">
                  Support the next generation of innovators and leaders. Your contributions help students
                  achieve their academic dreams at IIT Kharagpur.
               </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
               <div className="bg-gray-100 rounded-full p-1 shadow-sm">
                  <button
                     onClick={() => setFilter('all')}
                     className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'all'
                        ? 'bg-blue-800 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-800 hover:bg-white'
                        }`}
                  >
                     All Scholarships
                  </button>
                  <button
                     onClick={() => setFilter('ACTIVE')}
                     className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'ACTIVE'
                        ? 'bg-blue-800 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-800 hover:bg-white'
                        }`}
                  >
                     Active
                  </button>
                  <button
                     onClick={() => setFilter('COMPLETED')}
                     className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === 'COMPLETED'
                        ? 'bg-blue-800 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-800 hover:bg-white'
                        }`}
                  >
                     Completed
                  </button>
               </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                     <div className="p-3 bg-blue-100 rounded-lg mr-4">
                        <Target className="h-6 w-6 text-primary-blue" />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-dark-text">
                           {scholarships.length}
                        </p>
                        <p className="text-light-text">Total Scholarships</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                     <div className="p-3 bg-green-100 rounded-lg mr-4">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-dark-text">
                           ₹{scholarships.reduce((sum, s) => sum + s.current_amount, 0).toLocaleString()}
                        </p>
                        <p className="text-light-text">Total Raised</p>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center">
                     <div className="p-3 bg-purple-100 rounded-lg mr-4">
                        <Users className="h-6 w-6 text-purple-600" />
                     </div>
                     <div>
                        <p className="text-2xl font-bold text-dark-text">
                           {scholarships.reduce((sum, s) => sum + s.contribution_count, 0)}
                        </p>
                        <p className="text-light-text">Total Contributors</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Scholarships Grid */}
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
                  filteredScholarships.map(scholarship => (
                     <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                  ))
               )}
            </div>

            {!loading && filteredScholarships.length === 0 && (
               <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No scholarships found</h3>
                  <p className="text-gray-400">Try adjusting your filter or check back later.</p>
               </div>
            )}
         </div>
      </div>
   );
}

export default ScholarshipsPage;
