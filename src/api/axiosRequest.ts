import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';

const axiosRequest = async (method: 'get' | 'post', path: string, params: object = {}) => {
  const { ErrorStore, AuthStore } = MobxStore;
  const SERVER_URL: string | undefined = process.env.REACT_APP_SERVER_URL;
  const isReissueTokenPath = path === 'auth/reissue';
  if (!SERVER_URL) return;

  axios.interceptors.request.use((config) => {
    if (!config.headers) return config;

    const token = localStorage.getItem(
      `@wagglewaggle_${isReissueTokenPath ? 'refresh_token' : 'access_token'}`
    );
    if (token) {
      config.headers.Authrozation = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use((res) => {
    const { accessToken, refreshToken } = res.data;
    if (accessToken) {
      localStorage.setItem('@wagglewaggle_access_token', accessToken);
      AuthStore.setAuthorized(true);
    }
    if (refreshToken) {
      localStorage.setItem('@wagglewaggle_refresh_token', refreshToken);
    }
    return res;
  });

  try {
    return method === 'get'
      ? await axios.get(`${SERVER_URL}/${path}`, { params })
      : await axios.post(`${SERVER_URL}/${path}`, { ...params });
  } catch (e) {
    ErrorStore.setStatusCode((e as AxiosError).response?.status || null);
  }
};

export default axiosRequest;
