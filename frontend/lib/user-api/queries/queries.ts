import { api } from "../../api";

export const fetchSkills = async () => {
  const res = await api.get("/skills");
  return res.data;
};