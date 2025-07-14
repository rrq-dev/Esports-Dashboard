import axios from "axios";

const API_BASE_URL = "http://localhost:1010/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
