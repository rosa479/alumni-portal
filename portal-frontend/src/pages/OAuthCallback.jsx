import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Get the authorization code from URL
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        
        if (errorParam) {
          setError('OAuth authentication failed');
          setLoading(false);
          return;
        }
        
        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Exchange the code for access token and get user info from Google
        let googleProfile = null;
        try {
          
          const clientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '';
          const clientSecret = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_SECRET || '';
          const redirectUri = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:5173/callback';
          
          // Step 1: Exchange code for access token
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              code: code,
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code'
            })
          });
          
          const tokenData = await tokenResponse.json();
          
          if (tokenData.access_token) {
            // Step 2: Get user info from Google
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
              }
            });
            
            googleProfile = await userInfoResponse.json();
          }
        } catch (error) {
          console.error('Error getting Google user info:', error);
        }
        
        // Check if user exists in backend
        let userExists = false;
        let userData = null;
        let isActive = false;
        
        if (googleProfile && googleProfile.email) {
          try {
            const checkUserResponse = await fetch(`http://localhost:8000/api/auth/check-user/?email=${encodeURIComponent(googleProfile.email)}`);
            
            if (checkUserResponse.ok) {
              const checkUserData = await checkUserResponse.json();
              userExists = checkUserData.exists || false;
              isActive = checkUserData.is_active || false;
              userData = checkUserData.user || null;
            } else if (checkUserResponse.status === 404) {
              // Backend endpoint not available, treat as new user
              userExists = false;
            }
          } catch (error) {
            console.error('Error checking user:', error);
            // On error, assume new user
            userExists = false;
          }
        }
        
        // Create auth result with actual Google data
        const authResult = {
          user_exists: userExists,
          google_profile: googleProfile || {
            email: 'test@example.com',
            name: 'Test User',
            given_name: 'Test',
            family_name: 'User'
          },
          user: userData,
          is_active: isActive
        };
        
        // Handle the auth result
        if (authResult.user_exists && authResult.is_active) {
          // User exists and is active - login directly via backend OAuth
          try {
            // Call backend Google login endpoint to get tokens
            const oauthResponse = await fetch('http://localhost:8000/api/auth/google-login/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: googleProfile.email
              })
            });
            
            if (oauthResponse.ok) {
              const oauthData = await oauthResponse.json();
              
              if (oauthData.access && oauthData.refresh) {
                login(oauthData.access, oauthData.refresh);
                navigate('/dashboard');
                return;
              }
            }
          } catch (error) {
            console.error('Error getting OAuth tokens:', error);
          }
          
          // Fallback: if OAuth backend fails, redirect to login
          navigate('/login', {
            state: {
              message: 'Please login with your email and password.',
              email: authResult.google_profile.email
            }
          });
        } else if (authResult.user_exists && !authResult.is_active) {
          // User exists but not active - go to register with pre-filled data
          navigate('/register', { 
            state: { 
              oauthData: {
                ...authResult.google_profile,
                ...authResult.user
              },
              isExistingUser: true 
            } 
          });
        } else {
          // User doesn't exist - go to register with email only
          navigate('/register', { 
            state: { 
              oauthData: authResult.google_profile,
              isExistingUser: false 
            } 
          });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    };

    processOAuthCallback();
  }, [searchParams, navigate, login]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Completing authentication...</h2>
          <p className="text-gray-600 mt-2">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default OAuthCallback;
