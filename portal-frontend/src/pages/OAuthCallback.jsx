import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate requests (React Strict Mode runs effects twice in dev)
    if (hasProcessed.current) {
      return;
    }

    const processOAuthCallback = async () => {
      try {
        // Mark as processed immediately to prevent race conditions
        hasProcessed.current = true;
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

        // Use backend to securely exchange code for tokens and get user info
        const redirectUri = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:5173/callback';
        
        console.log('Making OAuth request to backend...');
        const oauthResponse = await fetch('http://localhost:8000/api/auth/google/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            redirect_uri: redirectUri
          })
        });

        if (!oauthResponse.ok) {
          const errorData = await oauthResponse.json();
          console.error('OAuth backend error:', errorData);
          setError(errorData.error || 'Authentication failed');
          setLoading(false);
          return;
        }

        const authResult = await oauthResponse.json();
        console.log('OAuth response received:', { 
          user_exists: authResult.user_exists, 
          status: authResult.status,
          has_tokens: !!(authResult.access && authResult.refresh)
        });
        
        // Handle the auth result based on user status
        if (authResult.user_exists && authResult.access && authResult.refresh) {
          // User exists and is VERIFIED - login with provided tokens
          login(authResult.access, authResult.refresh);
          navigate('/dashboard', { replace: true });
        } else if (authResult.user_exists && authResult.status === 'PENDING') {
          // User exists but PENDING - go to register/activate with pre-filled data
          navigate('/register', { 
            replace: true,
            state: { 
              oauthData: {
                ...authResult.google_profile,
                ...authResult.user
              },
              isExistingUser: true 
            } 
          });
        } else if (authResult.user_exists && authResult.status === 'REJECTED') {
          // User was rejected
          setError('Your account registration was rejected. Please contact support.');
          setLoading(false);
        } else if (authResult.google_profile) {
          // User doesn't exist - go to register
          navigate('/register', { 
            replace: true,
            state: { 
              oauthData: authResult.google_profile,
              isExistingUser: false 
            } 
          });
        } else {
          setError('Invalid response from authentication server');
          setLoading(false);
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
