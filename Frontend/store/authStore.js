import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

const backend_base_url =
  import.meta.env.MODE === "development" ? "http://localhost:8080/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  isLoading: false,
  error: null,
  popup: false,
  deleteAccPopup: false,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${backend_base_url}/signup`, { email, password, name });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      toast.success("User created successfully!");
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.msg || "Error signing up" });
      toast.error(error.response?.data?.msg || "Error signing up");
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${backend_base_url}/login`, { email, password });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.response?.data?.msg || "Error logging in" });
      toast.error(err.response?.data?.msg || "Error logging in");
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${backend_base_url}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: "Error logging out" });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await axios.get(`${backend_base_url}/check-auth`);
      set({ user: res.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.delete(`${backend_base_url}/delete-account`);
      if (res.data.success) {
        set({ isLoading: false, user: null, popup: false, isAuthenticated: false });
        toast.success(res.data.msg || "Account deleted");
      }
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.msg || "Error deleting account" });
    }
  },
}));
