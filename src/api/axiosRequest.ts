import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';

const axiosRequest = async (path: string, params: object = {}) => {
  const { ErrorStore } = MobxStore;
  const SERVER_URL: string | undefined = process.env.REACT_APP_SERVER_URL;
  if (!SERVER_URL) return;

  try {
    return await axios.get(`${SERVER_URL}/${path}`, { params: params });
  } catch (e) {
    ErrorStore.setStatusCode((e as AxiosError)?.response?.status || null);
  }
};

export default axiosRequest;
