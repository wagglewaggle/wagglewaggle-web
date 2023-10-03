import axios, { AxiosError } from 'axios';
import { MobxStore } from 'App';
import { PlaceDataType } from 'types/typeBundle';

const axiosInstance = async (method: MethodType, path: string, params: object = {}) => {
  const { ErrorStore } = MobxStore;
  const SERVER_URL: string | undefined = process.env.REACT_APP_SERVER_URL;
  if (!SERVER_URL) return;

  try {
    if (method === 'get') {
      return await axios.get(`${SERVER_URL}/${path}`, { params: params });
    }
  } catch (e) {
    ErrorStore.setStatusCode((e as AxiosError)?.response?.status || null);
  }
};

export const request = {
  getKtPlaces: async (params?: object) =>
    (await axiosInstance('get', 'kt-place', params)) as { data: { list: PlaceDataType[] } },
  getSktPlaces: async (params?: object) =>
    (await axiosInstance('get', 'skt-place', params)) as { data: { list: PlaceDataType[] } },
  getCategory: async () => await axiosInstance('get', 'category'),
  getLocationData: async (locationPath: string) =>
    await axiosInstance('get', `location/${locationPath}`),
  getLocationDetail: async (type: 'skt' | 'kt', placeId: string) =>
    await axiosInstance('get', `${type}-place/${placeId}`),
};

type MethodType = 'get';
