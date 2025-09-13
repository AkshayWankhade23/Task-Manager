import { useMutation } from "@tanstack/react-query";
import { api } from "../../api";

export const useAddSkill = () =>
  useMutation({
    mutationFn: async (skill: { name: string; level: number }) => {
      const res = await api.post("/skills", skill);
      return res.data;
    },
  });

export const useUpdateSkill = (id: string) =>
  useMutation({
    mutationFn: async (skill: { name: string; level: number }) => {
      const res = await api.put(`/skills/${id}`, skill);
      return res.data;
    },
  });

export const useDeleteSkill = () =>
  useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/skills/${id}`);
      return res.data;
    },
  });


