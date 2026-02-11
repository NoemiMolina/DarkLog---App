// Backend API URL - fallback to production backend
export const API_URL =
  import.meta.env.VITE_API_URL || "https://fearlogapp-backend.onrender.com";
