import { makeAutoObservable } from 'mobx';
import { CategoryType, LocationDataType, PlaceDataType } from 'types/typeBundle';

export class LocationStore {
  placeName: string | null = null;
  categories: { [key: string]: CategoryType[] } = {};
  suggestionExists: boolean = false;
  locationData: LocationDataType | null = null;
  placesData: PlaceDataType[] = [];
  currentLocationPinned: boolean = false;

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

  setPlacesData = (newPlacesData: PlaceDataType[]) => {
    this.placesData = newPlacesData;
  };

  setCurrentLocationPinned = (newStatus: boolean) => {
    this.currentLocationPinned = newStatus;
  };

  handlePinChange = (wasPinned: boolean) => {
    if (!this.locationData) return;
    this.locationData.pinPlaceCount += wasPinned ? -1 : 1;
    this.currentLocationPinned = !wasPinned;
  };
}
