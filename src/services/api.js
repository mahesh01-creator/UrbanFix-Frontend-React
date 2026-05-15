import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// REQUEST INTERCEPTOR
// ================================
api.interceptors.request.use(
  (config) => {

    const path = window.location.pathname;

    let token = null;

    // Detect module & attach correct token
    if (path.startsWith("/admin")) {

      token = localStorage.getItem("adminToken");

    } else if (path.startsWith("/worker")) {

      token = localStorage.getItem("workerToken");

    } else {

      token = localStorage.getItem("userToken");
    }

    // Add Authorization header
    if (token) {

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ================================
// RESPONSE INTERCEPTOR
// ================================
api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error("Response Error:", error.response);

    // Unauthorized
    if (error.response?.status === 401) {

      toast.error("Session expired");

      const path = window.location.pathname;

      if (path.startsWith("/admin")) {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";

      } else if (path.startsWith("/worker")) {

        localStorage.removeItem("workerToken");
        localStorage.removeItem("workerUser");

        window.location.href = "/worker/login";

      } else {

        localStorage.removeItem("userToken");
        localStorage.removeItem("userUser");

        window.location.href = "/user/login";
      }
    }

    // Forbidden
    if (error.response?.status === 403) {

      toast.error("You do not have permission");
    }

    // Server Error
    if (error.response?.status >= 500) {

      toast.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export default api;