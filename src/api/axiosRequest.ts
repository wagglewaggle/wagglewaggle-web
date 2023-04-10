import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';

const axiosRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  params: object = {}
) => {
  const { AxiosStore, AuthStore, ProfileStore, CustomDialogStore } = MobxStore;
  const SERVER_URL: string | undefined = process.env.REACT_APP_SERVER_URL;
  if (!SERVER_URL) return;

  const tokenAxiosInstance = axios.create();
  const apiAxiosInstance = axios.create();
  const isTokenIssuePath =
    ['reissue', 'naver', 'kakao', 'google'].filter((pathname: string) => path.includes(pathname))
      .length > 0;

  const handleCloseDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  const clearStorages = () => {
    localStorage.clear();
    sessionStorage.clear();
  };

  apiAxiosInstance.interceptors.request.use((config) => {
    if (path.split('/').includes('review-post')) {
      AxiosStore.setRequestInProgress(true);
    }
    if (!config.headers) return config;
    const token =
      localStorage.getItem(`@wagglewaggle_access_token`) ??
      sessionStorage.getItem('@wagglewaggle_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'any';
    return config;
  });

  apiAxiosInstance.interceptors.response.use(
    (res) => {
      if (path.split('/').includes('review-post')) {
        AxiosStore.setRequestInProgress(false);
      }
      return Promise.resolve(res);
    },
    async (err) => {
      const { errorCode } = err.response.data;
      if (errorCode === 'ERR_0006003') {
        if (sessionStorage.getItem('@wagglewaggle_reissuing')) {
          setTimeout(() => {
            if (path.split('/').includes('review-post')) {
              AxiosStore.setRequestInProgress(false);
            }
            return apiAxiosInstance(err.config);
          }, 500);
        }
        sessionStorage.setItem('@wagglewaggle_reissuing', 'true');
        await tokenAxiosInstance.post(`${SERVER_URL}/auth/reissue`, {
          refreshToken:
            localStorage.getItem('@wagglewaggle_refresh_token') ??
            sessionStorage.getItem('@wagglewaggle_refresh_token'),
        });
        sessionStorage.removeItem('@wagglewaggle_reissuing');
        if (path.split('/').includes('review-post')) {
          AxiosStore.setRequestInProgress(false);
        }
        return apiAxiosInstance(err.config);
      }

      if (path.split('/').includes('review-post')) {
        AxiosStore.setRequestInProgress(false);
      }
      CustomDialogStore.openNotificationDialog({
        title: '오류 발생',
        content: '오류가 발생했습니다.\n나중에 다시 시도해 주세요.',
        rightButton: {
          title: '확인',
          handleClick: handleCloseDialog,
        },
      });
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
  });

  tokenAxiosInstance.interceptors.response.use(
    async (res) => {
      const webStorage = sessionStorage.getItem('@wagglewaggle_auto_login_checked')
        ? localStorage
        : sessionStorage;
      const { accessToken, refreshToken } = res.data;
      if (accessToken) {
        webStorage.setItem('@wagglewaggle_access_token', accessToken);
        sessionStorage.setItem('@wagglewaggle_authorized', 'authorized');
        AuthStore.setAuthorized(true);
      }
      if (refreshToken) {
        webStorage.setItem('@wagglewaggle_refresh_token', refreshToken);
      }
      if (!localStorage.getItem('@wagglewaggle_user_nickname')) {
        const response = await axiosRequest('get', 'user/setting');
        if (response?.data) {
          localStorage.setItem('@wagglewaggle_user_nickname', response.data.nickname);
          ProfileStore.setUserNickname(response.data.nickname);
        }
      }
      return res;
    },
    (err) => {
      clearStorages();
      const { errorCode } = err.response.data;
      if (['ERR_0006002', 'ERR_0006011'].includes(errorCode)) {
        const isLocked = errorCode === 'ERR_0006011';
        CustomDialogStore.openNotificationDialog({
          title: isLocked ? '계정정지 안내' : '계정 탈퇴안내',
          content: isLocked
            ? '죄송합니다. 본 계정은 현재 활동이 불가합니다.\n자세한 사유 및 이의 신청은 하단 이메일로 접수\n부탁드립니다.'
            : '죄송합니다. 해당 계정은 현재 탈퇴 계정으로\n로그인이 불가합니다.\n탈퇴 후 7일 이후에 재가입 가능합니다.',
          subContent: isLocked ? '접수 이메일 : wagglewaggle2@gmail.com' : '',
          rightButton: {
            title: '확인',
            handleClick: handleCloseDialog,
          },
        });
      } else {
        CustomDialogStore.openNotificationDialog({
          title: '로그인 오류',
          content: '로그인하는데에 오류가 발생했습니다. 다시 로그인 해주세요.',
          rightButton: {
            title: '확인',
            handleClick: handleCloseDialog,
          },
        });
        window.location.href = window.location.origin + '/login';
      }
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
    AxiosStore.setStatusCode((e as AxiosError).response?.status || null);
    console.log(e);
  }
};

export default axiosRequest;
