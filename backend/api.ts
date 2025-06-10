// utils/api.ts
import axios from "axios";

const flaskAPI = axios.create({
  baseURL: "http://localhost:5000", // or your deployed URL
});

export const predictDropout = async (formData: Record<string, any>) => {
  const res = await flaskAPI.post("/predict", formData);
  return res.data.prediction;
};
