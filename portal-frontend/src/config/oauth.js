// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '395218970441-tkujr9gj2agl87k0i3b4p6n8c9ac32bm.apps.googleusercontent.com',
  redirectUri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI || `${import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/callback`,
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
};

export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?` +
  `client_id=${GOOGLE_OAUTH_CONFIG.clientId}&` +
  `redirect_uri=${encodeURIComponent(GOOGLE_OAUTH_CONFIG.redirectUri)}&` +
  `scope=${encodeURIComponent(GOOGLE_OAUTH_CONFIG.scope)}&` +
  `response_type=${GOOGLE_OAUTH_CONFIG.responseType}&` +
  `access_type=${GOOGLE_OAUTH_CONFIG.accessType}&` +
  `prompt=${GOOGLE_OAUTH_CONFIG.prompt}`;
