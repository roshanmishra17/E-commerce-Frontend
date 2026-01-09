import api from "./axios";

export const testBackend = async () => {
  const res = await api.get("/");
  return res.data;
};