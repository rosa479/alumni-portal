import { GOOGLE_AUTH_URL, GOOGLE_OAUTH_CONFIG } from '../config/oauth';
import apiClient from '../interceptor';

// Initiate Google OAuth flow
export const initGoogleAuth = () => {
  window.location.href = GOOGLE_AUTH_URL;
};

// Handle OAuth callback
export const handleOAuthCallback = async (code) => {
  console.log('=== OAuth Callback Debug ===');
  console.log('Code received:', code);
  console.log('API client base URL:', apiClient.defaults.baseURL);
  
  // For now, let's just return the mock response directly to test the flow
  console.log('Returning mock response directly for testing');
  
  const mockResponse = {
    user_exists: false,
    google_profile: {
      email: 'test@example.com',
      name: 'Test User',
      given_name: 'Test',
      family_name: 'User'
    }
  };
  
  console.log('Mock response created:', mockResponse);
  console.log('About to return mock response');
  
  return mockResponse;
  
  // Commented out the actual API call for now
  /*
  try {
    console.log('Making API call to /auth/google/ with code:', code);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        console.log('Request timeout after 5 seconds');
        reject(new Error('Request timeout'));
      }, 5000);
    });
    
    const apiPromise = apiClient.post('/auth/google/', {
      code: code,
      redirect_uri: 'http://localhost:5173/callback'
    });
    
    console.log('Starting Promise.race...');
    const response = await Promise.race([apiPromise, timeoutPromise]);
    console.log('API response received:', response);
    return response.data;
  } catch (error) {
    console.error('=== OAuth Callback Error ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error status:', error.response?.status);
    console.error('Error response:', error.response);
    
    // Temporary mock response for testing when backend is not available
    if (error.response?.status === 404 || error.message === 'Request timeout') {
      console.log('Backend not available (404 or timeout), returning mock response');
      return {
        user_exists: false,
        google_profile: {
          email: 'test@example.com',
          name: 'Test User',
          given_name: 'Test',
          family_name: 'User'
        }
      };
    }
    
    console.log('Throwing error:', error);
    throw error;
  }
  */
};

// Check if user exists
export const checkUserExists = async (email) => {
  try {
    const response = await apiClient.get(`/auth/check-user/?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Check user error:', error);
    throw error;
  }
};

// Get user profile from Google
export const getGoogleProfile = async (accessToken) => {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    return await response.json();
  } catch (error) {
    console.error('Get Google profile error:', error);
    throw error;
  }
};
