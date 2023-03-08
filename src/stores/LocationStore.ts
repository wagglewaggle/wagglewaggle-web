import { makeAutoObservable } from 'mobx';
import { CategoryType, LocationDataType } from 'types/typeBundle';

export class LocationStore {
  placeName: string | null = null;
  categories: { [key: string]: CategoryType[] } = {};
  suggestionExists: boolean = false;
  locationData: LocationDataType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPlaceName = (newPlaceName: string) => {
    this.placeName = newPlaceName;
  };

  setCategories = (key: string, categories: CategoryType[]) => {
    this.categories[key] = categories;
  };

  setSuggestionExists = (newState: boolean) => {
    this.suggestionExists = newState;
  };

  setLocationData = (newLocationData: LocationDataType | null) => {
    this.locationData = newLocationData;
  };
}
