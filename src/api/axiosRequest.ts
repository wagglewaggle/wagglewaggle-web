import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';

const axiosRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  params: object = {}
) => {
  const { ErrorStore, AuthStore, ProfileStore } = MobxStore;
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
    config.headers['ngrok-skip-browser-warning'] = 'any';
    return config;
  });

  apiAxiosInstance.interceptors.response.use(
    (res) => Promise.resolve(res),
    async (err) => {
      const { errorCode } = err.response.data;
      if (errorCode === 'ERR_0006003') {
        if (sessionStorage.getItem('@wagglewaggle_reissuing')) return;
        sessionStorage.setItem('@wagglewaggle_reissuing', 'true');
        await tokenAxiosInstance.post(`${SERVER_URL}/auth/reissue`, {
          refreshToken:
            localStorage.getItem('@wagglewaggle_refresh_token') ??
            sessionStorage.getItem('@wagglewaggle_refresh_token'),
        });
        sessionStorage.removeItem('@wagglewaggle_reissuing');
      }
      if (['ERR_0006007', 'ERR_0006010'].includes(errorCode)) {
        return err.response;
      }
      return err;
    }
  );

  tokenAxiosInstance.interceptors.request.use((config) => {
    if (!config.headers) return config;
    config.headers['ngrok-skip-browser-warning'] = 'any';
    return config;
  })

  tokenAxiosInstance.interceptors.response.use(
    async (res) => {
      const { accessToken, refreshToken } = res.data;
      if (accessToken) {
        localStorage.setItem('@wagglewaggle_access_token', accessToken);
        sessionStorage.setItem('@wagglewaggle_authorized', 'authorized');
        AuthStore.setAuthorized(true);
      }
      if (refreshToken) {
        const webStorage = sessionStorage.getItem('@wagglewaggle_auto_login_checked')
          ? localStorage
          : sessionStorage;
        webStorage.setItem('@wagglewaggle_refresh_token', refreshToken);
      }
      if (!sessionStorage.getItem('@wagglewaggle_user_nickname')) {
        const response = await axiosRequest('get', 'user/setting');
        if (response?.data) {
          sessionStorage.setItem('@wagglewaggle_user_nickname', response.data.nickname);
          ProfileStore.setUserNickname(response.data.nickname);
        }
      }
      return res;
    },
    () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = window.location.origin + '/login';
    }
  );

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
    console.log(e);
  }
};

export default axiosRequest;
