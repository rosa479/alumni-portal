import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Users, Calendar, Target, TrendingUp, ArrowLeft, Share2, Clock, CheckCircle, X, User as UserIcon, Copy, Check } from 'react-feather';
import apiClient from '../interceptor';

function ContributionDetailPage() {
   const { contributionId } = useParams();
   const [contribution, setContribution] = useState(null);
   const [contributors, setContributors] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [donationAmount, setDonationAmount] = useState(1000);
   const [showDonationForm, setShowDonationForm] = useState(false);
   const [showContributorsModal, setShowContributorsModal] = useState(false);
   const [showShareModal, setShowShareModal] = useState(false);
   const [copied, setCopied] = useState(false);

   useEffect(() => {
      const fetchContributionDetails = async () => {
         try {
            setLoading(true);
            setError(null);
            
            // Fetch scholarship details
            const scholarshipResponse = await apiClient.get(`/scholarships/${contributionId}/`);
            const scholarshipData = scholarshipResponse.data;
            
            // Fetch contributors list
            const contributorsResponse = await apiClient.get(`/scholarships/${contributionId}/endowment/list/`);
            const contributorsData = contributorsResponse.data;
            
            // Transform the data to match component expectations
            const transformedContribution = {
               id: scholarshipData.id,
               title: scholarshipData.title,
               description: scholarshipData.description,
               long_description: scholarshipData.description, // You might want to add a separate field for this
               target_amount: parseFloat(scholarshipData.target_amount),
               current_amount: parseFloat(scholarshipData.current_amount),
               progress_percentage: scholarshipData.progress_percentage,
               remaining_amount: scholarshipData.remaining_amount,
               created_at: scholarshipData.created_at,
               updated_at: scholarshipData.updated_at,
               image_url: scholarshipData.image_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
               contribution_count: contributorsData.length,
               status: scholarshipData.status,
               deadline: scholarshipData.updated_at, // You might want to add a deadline field to the model
               created_by_name: scholarshipData.created_by_name || 'Anonymous'
            };
            
            // Transform contributors data
            const transformedContributors = contributorsData.map(contributor => ({
               name: contributor.is_anonymous ? 'Anonymous' : (contributor.contributor_name || 'Anonymous'),
               amount: parseFloat(contributor.amount),
               is_anonymous: contributor.is_anonymous,
               created_at: contributor.created_at,
               message: contributor.message || ''
            }));
            
            setContribution(transformedContribution);
            setContributors(transformedContributors);
            
         } catch (err) {
            console.error('Error fetching contribution details:', err);
            if (err.response?.status === 404) {
               setError('Contribution not found');
            } else {
               setError('Failed to load contribution details');
            }
         } finally {
            setLoading(false);
         }
      };

      if (contributionId) {
         fetchContributionDetails();
      }
   }, [contributionId]);

   const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
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

   const formatDateTime = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   const calculateContributionPercentage = (amount, totalAmount) => {
      return ((amount / totalAmount) * 100).toFixed(1);
   };

   const handleDonate = async () => {
      try {
         const contributionData = {
            amount: donationAmount,
            is_anonymous: false,
            message: ''
         };
         
         await apiClient.post(`/scholarships/${contributionId}/endowment/`, contributionData);
         
         alert(`Thank you for your donation of ${formatCurrency(donationAmount)} to ${contribution.title}!`);
         setShowDonationForm(false);
         
         // Refresh the page data
         window.location.reload();
         
      } catch (error) {
         console.error('Error making donation:', error);
         alert('Failed to process donation. Please try again.');
      }
   };

   const generateShareText = () => {
      const contributionUrl = `${window.location.origin}/endowment/${contribution.id}`;
      return `🎓 ${contribution.title}\n\n${contribution.description}\n\n💰 Target: ${formatCurrency(contribution.target_amount)}\n📈 Progress: ${contribution.progress_percentage.toFixed(1)}%\n\nHelp support this contribution: ${contributionUrl}\n\n#IITKGP #Scholarship #Education`;
   };

   const copyToClipboard = async () => {
      try {
         await navigator.clipboard.writeText(generateShareText());
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error('Failed to copy: ', err);
         const textArea = document.createElement('textarea');
         textArea.value = generateShareText();
         document.body.appendChild(textArea);
         textArea.select();
         document.execCommand('copy');
         document.body.removeChild(textArea);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      }
   };

   const shareOnWhatsApp = () => {
      const shareText = generateShareText();
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
   };

   const shareOnTwitter = () => {
      const shareText = `🎓 ${contribution.title} - Help support this contribution at IIT Kharagpur! ${window.location.origin}/endowment/${contribution.id}`;
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      window.open(twitterUrl, '_blank');
   };

   const shareOnLinkedIn = () => {
      const shareText = `🎓 ${contribution.title} - Help support this contribution at IIT Kharagpur!`;
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/endowment/' + contribution.id)}&title=${encodeURIComponent(shareText)}`;
      window.open(linkedinUrl, '_blank');
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 py-4 sm:py-8">
            <div className="container mx-auto px-4 max-w-6xl">
               {/* Loading skeleton - same as before */}
               <div className="mb-6">
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                     <div className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>
                     <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                     </div>
                  </div>
                  <div className="lg:col-span-1">
                     <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4 animate-pulse"></div>
                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (error || !contribution) {
      return (
         <div className="min-h-screen bg-light-bg py-8">
            <div className="container mx-auto px-4">
               <div className="text-center">
                  <h1 className="text-2xl font-bold text-dark-text mb-4">
                     {error || "Contribution not found"}
                  </h1>
                  <p className="text-gray-600 mb-6">
                     The contribution you're looking for doesn't exist or has been removed.
                  </p>
                  <Link 
                     to="/endowment" 
                     className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                     ← Back to Endowment
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-light-bg py-8">
         <div className="container mx-auto px-4 max-w-6xl">
            {/* Back Button */}
            <div className="mb-6">
               <Link
                  to="/endowment"
                  className="inline-flex items-center text-primary-blue hover:text-blue-600 transition-colors"
               >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Endowment
               </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
               {/* Main Content */}
               <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                  {/* Hero Image */}
                  <div>
                     <img
                        src={contribution.image_url}
                        alt={contribution.title}
                        className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl shadow-lg"
                     />
                  </div>

                  {/* Scholarship Info */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                     <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                        <div className="flex-1">
                           <h1 className="text-2xl sm:text-3xl font-bold text-dark-text mb-2">{contribution.title}</h1>
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-light-text">
                              <div className="flex items-center">
                                 <Calendar className="w-4 h-4 mr-2" />
                                 <span className="text-sm sm:text-base">Created {formatDate(contribution.created_at)}</span>
                              </div>
                              {contribution.created_by_name && (
                                 <div className="flex items-center">
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    <span className="text-sm sm:text-base">by {contribution.created_by_name}</span>
                                 </div>
                              )}
                           </div>
                        </div>
                        <span className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto ${
                           contribution.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                           {contribution.status}
                        </span>
                     </div>

                     <p className="text-base sm:text-lg text-light-text leading-relaxed mb-6">
                        {contribution.description}
                     </p>

                     {contribution.long_description && contribution.long_description !== contribution.description && (
                        <div className="prose max-w-none">
                           <h3 className="text-lg sm:text-xl font-bold text-dark-text mb-4">About This Contribution</h3>
                           <div className="text-sm sm:text-base text-light-text leading-relaxed whitespace-pre-line">
                              {contribution.long_description}
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 sm:top-8">
                     {/* Progress */}
                     <div className="mb-6">
                        <h3 className="text-base sm:text-lg font-bold text-dark-text mb-4">Funding Progress</h3>
                        <div className="mb-4">
                           <div className="flex justify-between text-xs sm:text-sm text-light-text mb-2">
                              <span>Progress</span>
                              <span>{contribution.progress_percentage.toFixed(1)}%</span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                              <div
                                 className="bg-blue-800 h-2 sm:h-3 rounded-full transition-all duration-500"
                                 style={{ width: `${Math.min(100, contribution.progress_percentage)}%` }}
                              ></div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                           <div>
                              <p className="text-light-text">Target</p>
                              <p className="font-bold text-dark-text text-sm sm:text-base">{formatCurrency(contribution.target_amount)}</p>
                           </div>
                           <div>
                              <p className="text-light-text">Raised</p>
                              <p className="font-bold text-blue-800 text-sm sm:text-base">{formatCurrency(contribution.current_amount)}</p>
                           </div>
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="mb-6 space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center text-light-text">
                              <Users className="w-4 h-4 mr-2" />
                              <span className="text-sm sm:text-base">Contributors</span>
                           </div>
                           {contribution.contribution_count > 0 ? (
                              <button
                                 onClick={() => setShowContributorsModal(true)}
                                 className="font-bold text-blue-800 hover:text-orange-600 transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                              >
                                 {contribution.contribution_count}
                              </button>
                           ) : (
                              <span className="font-bold text-dark-text text-sm sm:text-base">0</span>
                           )}
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center text-light-text">
                              <Target className="w-4 h-4 mr-2" />
                              <span className="text-sm sm:text-base">Remaining</span>
                           </div>
                           <span className="font-bold text-dark-text text-sm sm:text-base">{formatCurrency(contribution.remaining_amount)}</span>
                        </div>
                     </div>

                     {/* Donation Form */}
                     {!showDonationForm ? (
                        <button
                           onClick={() => setShowDonationForm(true)}
                           className="w-full bg-blue-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-orange-600 transition-colors duration-200 mb-4 text-sm sm:text-base"
                        >
                           Contribute Now
                        </button>
                     ) : (
                        <div className="space-y-3 sm:space-y-4">
                           <div>
                              <label className="block text-xs sm:text-sm font-medium text-dark-text mb-2">
                                 Donation Amount (INR)
                              </label>
                              <input
                                 type="number"
                                 value={donationAmount}
                                 onChange={(e) => setDonationAmount(Number(e.target.value))}
                                 className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none text-sm sm:text-base"
                                 placeholder="Enter amount"
                                 min="1"
                              />
                           </div>
                           <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                 onClick={handleDonate}
                                 disabled={!donationAmount || donationAmount < 1}
                                 className="flex-1 bg-blue-800 text-white font-bold py-2 sm:py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 Donate
                              </button>
                              <button
                                 onClick={() => setShowDonationForm(false)}
                                 className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                              >
                                 Cancel
                              </button>
                           </div>
                        </div>
                     )}

                     {/* Share Button */}
                     <button 
                        onClick={() => setShowShareModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-2 sm:py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                     >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Contributors Modal */}
         {showContributorsModal && contributors.length > 0 && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
               <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden mx-2 sm:mx-0">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                     <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-dark-text">Contributors</h2>
                        <p className="text-sm sm:text-base text-light-text mt-1 truncate">
                           {contribution.contribution_count} contributors • {formatCurrency(contribution.current_amount)} raised
                        </p>
                     </div>
                     <button
                        onClick={() => setShowContributorsModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-2"
                     >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                     </button>
                  </div>

                  {/* Modal Content */}
                  <div className="overflow-y-auto max-h-[60vh]">
                     <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        {contributors.map((contributor, index) => (
                           <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <div className="flex items-center flex-1 min-w-0">
                                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 flex-shrink-0">
                                    {contributor.is_anonymous ? (
                                       <UserIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                                    ) : (
                                       contributor.name.charAt(0).toUpperCase()
                                    )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                       <p className="font-semibold text-dark-text text-sm sm:text-base truncate">
                                          {contributor.is_anonymous ? 'Anonymous' : contributor.name}
                                       </p>
                                       {contributor.is_anonymous && (
                                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full flex-shrink-0">
                                             Anonymous
                                          </span>
                                       )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-light-text">
                                       {formatDateTime(contributor.created_at)}
                                    </p>
                                    {contributor.message && (
                                       <p className="text-xs sm:text-sm text-gray-600 mt-1 italic truncate">
                                          "{contributor.message}"
                                       </p>
                                    )}
                                 </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-2">
                                 <p className="font-bold text-blue-800 text-base sm:text-lg">
                                    {formatCurrency(contributor.amount)}
                                 </p>
                                 <p className="text-xs sm:text-sm text-light-text">
                                    {calculateContributionPercentage(contributor.amount, contribution.current_amount)}% of total
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                     <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-sm text-light-text text-center sm:text-left">
                           Total raised: <span className="font-bold text-dark-text">{formatCurrency(contribution.current_amount)}</span>
                        </div>
                        <button
                           onClick={() => setShowContributorsModal(false)}
                           className="w-full sm:w-auto px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                        >
                           Close
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Share Modal */}
         {showShareModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-0">
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                     <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-dark-text">Share Contribution</h2>
                        <p className="text-sm sm:text-base text-light-text mt-1">
                           Help spread the word about this contribution
                        </p>
                     </div>
                     <button
                        onClick={() => setShowShareModal(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ml-2"
                     >
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                     </button>
                  </div>

                  <div className="p-4 sm:p-6">
                     <div className="space-y-4">
                        <button
                           onClick={copyToClipboard}
                           className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
                        >
                           {copied ? (
                              <>
                                 <Check className="w-5 h-5" />
                                 <span>Copied to Clipboard!</span>
                              </>
                           ) : (
                              <>
                                 <Copy className="w-5 h-5" />
                                 <span>Copy Link & Text</span>
                              </>
                           )}
                        </button>

                        <div className="space-y-3">
                           <p className="text-sm text-gray-600 text-center">Share on social media:</p>
                           
                           <button
                              onClick={shareOnWhatsApp}
                              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                           >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                              </svg>
                              <span>Share on WhatsApp</span>
                           </button>

                           <button
                              onClick={shareOnTwitter}
                              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                           >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                              </svg>
                              <span>Share on Twitter</span>
                           </button>

                           <button
                              onClick={shareOnLinkedIn}
                              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
                           >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                              <span>Share on LinkedIn</span>
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                     <button
                        onClick={() => setShowShareModal(false)}
                        className="w-full px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default ContributionDetailPage;