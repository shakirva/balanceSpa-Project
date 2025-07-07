import axios from "axios";
import { BASE_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use((request) => {
  request.headers["Content-Type"] =
    request.data instanceof FormData
      ? "multipart/form-data"
      : "application/json";
  return request;
});

export default axiosInstance;
