import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import createAuthRefreshInceptor from "axios-auth-refresh";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface AuthResponse {
  accessToken: string;
  user: any;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (cfg: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }

    return cfg;
  },
  (error) => Promise.reject(error)
);

const refreshAuth = async (failedRequest: any): Promise<void> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      "/api/shg-auth/refresh",
      null,
      {
        baseURL: API_BASE_URL,
        withCredentials: true,
      }
    );

    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);

    return Promise.resolve();
  } catch (error) {
    localStorage.removeItem("token");
    window.location.assign("/");
    return Promise.reject(error);
  }
};

createAuthRefreshInceptor(apiClient, refreshAuth);

export default apiClient;
