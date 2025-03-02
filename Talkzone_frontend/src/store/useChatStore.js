import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axiosInstance.get(`${BASE_URL}/messages/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res && res.data) {
        set({ users: res.data });
      } else {
        throw new Error('Get users failed: No response data');
      }
    } catch (error) {
      console.error("Error in getUsers:", error);
      toast.error(error.response?.data?.message || 'Failed to get users');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const res = await axiosInstance.get(`${BASE_URL}/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const token = useAuthStore.getState().token;
      const res = await axiosInstance.post(`${BASE_URL}/messages/send/${selectedUser._id}`, messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res && res.data) {
        set({ messages: [...messages, res.data] });
      } else {
        throw new Error('Send message failed: No response data');
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error(error.response?.data?.message || 'Send message failed');
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
