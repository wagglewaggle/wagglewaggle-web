import { makeAutoObservable } from 'mobx';

export class LocationStore {
  placeName: string | null = null;
  categories: string[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPlaceName = (newPlaceName: string) => {
    this.placeName = newPlaceName;
  };

  setCategories = (newCategories: string[]) => {
    this.categories = newCategories;
  };
}
