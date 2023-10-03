import { PlaceDataType } from 'types/typeBundle';

const statusArr: string[] = ['VERY_RELAXATION', 'RELAXATION', 'NORMAL', 'CROWDED', 'VERY_CROWDED'];

export const filterPlaceCard = (dataList: PlaceDataType[]) => {
  return dataList.sort((prev: PlaceDataType, next: PlaceDataType) => {
    if (!prev.population) return 1;
    if (!next.population) return -1;
    const prevLevel = statusArr.indexOf(prev.population.level);
    const nextLevel = statusArr.indexOf(next.population.level);
    if (prevLevel > nextLevel) return 1;
    else if (nextLevel > prevLevel) return -1;
    return 0;
  });
};
