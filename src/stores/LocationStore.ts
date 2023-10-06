import { makeAutoObservable } from 'mobx';
import { PlaceDataType } from 'types/typeBundle';

export class LocationStore {
  allPlaces: PlaceDataType[] = [];
  placeName: string | null = null;
  suggestionExists: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAllPlaces = (allPlaces: PlaceDataType[]) => {
    this.allPlaces = allPlaces;
  };

  setPlaceName = (newPlaceName: string) => {
    this.placeName = newPlaceName;
  };

  setSuggestionExists = (newState: boolean) => {
    this.suggestionExists = newState;
  };
}
