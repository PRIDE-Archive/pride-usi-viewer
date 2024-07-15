import Axios, {
  AxiosError,
  type AxiosResponse,
} from "axios";

import { Message } from 'view-ui-plus'
// import { getToken } from "@/store";

const server = Axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // timeout: 6000,
  withCredentials: false,
});

server.interceptors.request.use(
  (config: any) => {

    // const store = useStore();
    // let token = getToken();
    // // console.log('token:', token);
    // config.headers!['token'] = token;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

server.interceptors.response.use(
  (response: AxiosResponse) => {
    let { data } = response;

    // const newToken = response.headers['x-new-token'];
    // if (newToken) {
    //   localStorage.setItem('token', newToken);
    //   console.log('New token received:', newToken);
    // }
    return Promise.resolve(data);
  },
  (error: AxiosError) => {
    // console.error(error.toJSON());
    // console.error(error.response);
    Message.error(`Request Failed!`);
    return Promise.reject(error);
  }
);

export const get = (url: string, params: any) => {
  return server.get(url, { params });
};

export const post = (url: string, data: any) => {
  return server.post(url, JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
