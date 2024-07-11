import Axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";


const server = Axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 6000,
  withCredentials: false,
});

export const get = (url: string, params: any) => {
  return server.get(url, { params });
};

export const post = (url: string, data: any) => {
  return server.post(url, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

