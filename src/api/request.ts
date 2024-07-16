import Axios, {
  AxiosError,
  type AxiosResponse,
} from "axios";

import { Message } from 'view-ui-plus'

const server = Axios.create({
  baseURL: 'https://www.ebi.ac.uk',
  // timeout: 6000,
  withCredentials: false,
});

server.interceptors.request.use(
  (config: any) => {

    // const store = useStore();
    // let token = getToken();
    // // console.log('token:', token);
    // config.headers!['token'] = token;
    let url = config.url
    if (config.method === 'get' && config.params) {
      url += '?'
      let keys = Object.keys(config.params)
      for (let key of keys) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
    }
    config.url = url

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
