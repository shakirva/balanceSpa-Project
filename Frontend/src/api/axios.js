// 📁 frontend/api/axios.js
import axios from "axios";
import { BASE_URL } from "../config";

export { BASE_URL };

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
