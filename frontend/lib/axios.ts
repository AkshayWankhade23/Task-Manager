import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Change this when deploying
  withCredentials: true,
});

export default api;
