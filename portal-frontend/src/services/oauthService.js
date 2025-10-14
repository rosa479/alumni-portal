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
