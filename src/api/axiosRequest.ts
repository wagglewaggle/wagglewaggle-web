import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';

const axiosRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  params: object = {}
) => {
  const { ErrorStore, AuthStore } = MobxStore;
  const SERVER_URL: string | undefined = process.env.REACT_APP_SERVER_URL;
  if (!SERVER_URL) return;

  const tokenAxiosInstance = axios.create();
  const apiAxiosInstance = axios.create();
  const isTokenIssuePath =
    ['reissue', 'naver', 'kakao', 'google'].filter((pathname: string) => path.includes(pathname))
      .length > 0;

  apiAxiosInstance.interceptors.request.use((config) => {
    if (!config.headers) return config;
    const token = localStorage.getItem(`@wagglewaggle_access_token`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  tokenAxiosInstance.interceptors.response.use((res) => {
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
    const selectedAxiosInstance = isTokenIssuePath ? tokenAxiosInstance : apiAxiosInstance;
    return method === 'get'
      ? await selectedAxiosInstance.get(`${SERVER_URL}/${path}`, { params })
      : method === 'post'
      ? await selectedAxiosInstance.post(`${SERVER_URL}/${path}`, { ...params })
      : method === 'put'
      ? await selectedAxiosInstance.put(`${SERVER_URL}/${path}`, { ...params })
      : await selectedAxiosInstance.delete(`${SERVER_URL}/${path}`, { data: { ...params } });
  } catch (e) {
    ErrorStore.setStatusCode((e as AxiosError).response?.status || null);
  }
};

export default axiosRequest;
