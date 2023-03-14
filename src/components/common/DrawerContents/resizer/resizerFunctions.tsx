import { MobxStore } from 'App';
import { NavigateFunction } from 'react-router-dom';
import { CctvType, PlaceDataType } from 'types/typeBundle';

export const resizerFunctions: () => { [key: string]: () => void } = () => {
  const { CustomDialogStore, CustomDrawerStore, LocationStore } = MobxStore;

  return {
    share: () => {
      alert('share');
    },
    navi: () => {
      alert('navi');
    },
    cctv: () => {
      CustomDialogStore.openCctvDialog(
        (CustomDrawerStore.rndResizerFunctionConfig.functionProps as CctvType[]) ?? []
      );
    },
    placeCard: () => {
      const [place, navigate] = CustomDrawerStore.rndResizerFunctionConfig.functionProps as [
        PlaceDataType,
        NavigateFunction
      ];
      LocationStore.setPlaceName(place.name);
      navigate(`/${CustomDrawerStore.variant}/detail/${place.idx}?name=${place.name}`);
    },
  };
};
