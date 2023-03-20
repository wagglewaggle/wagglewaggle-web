import { MobxStore } from 'App';
import axiosRequest from 'api/axiosRequest';
import { PlaceDataType } from 'types/typeBundle';

const initPlaceData = async () => {
  const { LocationStore } = MobxStore;
  const params = { populationSort: true };
  const placeData: { data: { list: PlaceDataType[] } } | undefined = await axiosRequest(
    'get',
    'place',
    params
  );
  if (!placeData) return;
  LocationStore.setPlacesData([...placeData.data.list]);
  [...placeData.data.list].forEach((data: PlaceDataType) => {
    LocationStore.setCategories(data.name, data.categories);
  });
};

export default initPlaceData;