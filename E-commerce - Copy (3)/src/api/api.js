import axios from "axios";

export const BASE_URL =
  "https://ecommerce.routemisr.com/api/v1";

// Axios instance واحد للمشروع كله
const api = axios.create({
  baseURL: BASE_URL,
});

// إضافة الـ token تلقائيًا لكل request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.token = token;
  }

  return config;
});

// ================================
// Orders
// ================================

export const GetUserOrders = () => {
  return api.get("/orders/user/");
};

export default api;