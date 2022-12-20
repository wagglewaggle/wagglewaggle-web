import { makeAutoObservable } from 'mobx';
import { categoryType } from 'types/typeBundle';

export class LocationStore {
  placeName: string | null = null;
  categories: { [key: string]: categoryType[] } = {};

  constructor() {
    makeAutoObservable(this);
  }

  setPlaceName = (newPlaceName: string) => {
    this.placeName = newPlaceName;
  };

  setCategories = (key: string, categories: categoryType[]) => {
    this.categories[key] = categories;
  };
}
