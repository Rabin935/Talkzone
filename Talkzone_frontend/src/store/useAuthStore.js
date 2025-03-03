import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    const navigate = useNavigate(); // Move useNavigate inside the method
    try {
      const token = get().token;
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ user: res.data.user, token: res.data.token });
      get().connectSocket();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized - Redirecting to login");
        navigate("/login"); // Use navigate correctly
      } else {
        console.log("Error in checkAuth:", error);
      }
      set({ user: null, token: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (signupData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", signupData);
      set({ user: res.data.user, token: res.data.token });
      toast.success("Signup successful!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const navigate = useNavigate();
      const res = await axiosInstance.post("/auth/login", data);
      set({ user: res.data.user, token: res.data.token });
      toast.success("Logged in successfully");
      get().connectSocket();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, token: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const token = get().token;
      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ user: res.data.user, token: res.data.token });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;

    try {
      const socket = io(BASE_URL, {
        query: {
          userId: user._id,
        },
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        toast.error("Socket connection failed");
      });

      set({ socket: socket });

      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    } catch (error) {
      console.error("Error connecting to socket:", error);
      toast.error("Error connecting to socket");
    }
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));