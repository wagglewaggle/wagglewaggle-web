import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';

const axiosRequest = async (path: string) => {
  const { ErrorStore } = MobxStore;

  try {
    return await axios.get(path);
  } catch (e) {
    ErrorStore.setStatusCode((e as AxiosError)?.response?.status || null);
  }
};

export default axiosRequest;
