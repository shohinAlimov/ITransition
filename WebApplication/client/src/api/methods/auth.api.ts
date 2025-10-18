import { api } from "../axios";
import { type User } from "../../types/userSchema";

interface AuthResponse {
  message: string;
  user: User;
  error?: string;
}

export const authService = {
  /* Register a new user */
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<User> => {
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/register", {
        name,
        email,
        password,
      });
      return data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration Failed");
    }
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const { data } = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      return data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login Failed");
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const { data } = await api.get<AuthResponse>("/api/auth/me");
      return data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/api/auth/logout");
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Logout failed");
    }
  },
};
