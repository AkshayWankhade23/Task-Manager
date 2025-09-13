import { useMutation } from "@tanstack/react-query";
import { api } from "./api";
import {
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
} from "@/types/auth";

export const useRegister = () =>
  useMutation({
    mutationFn: async (data: RegisterInput): Promise<RegisterResponse> => {
      const res = await api.post("/auth/register", data);
      return res.data;
    },
    onError: (error) => {
      console.error("Register error:", error);
    },
  });

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: LoginInput): Promise<LoginResponse> => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
