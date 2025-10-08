import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // Your backend URL
});

// Request Interceptor: Attach the access token to every request
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token refresh logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and it's not a retry request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // If no refresh token, logout immediately
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // **THIS IS THE CRITICAL PART**
        // If the refresh token is expired or invalid, force a logout.
        console.error("Token refresh failed. Logging out.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Force a full page redirect to clear all application state
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
