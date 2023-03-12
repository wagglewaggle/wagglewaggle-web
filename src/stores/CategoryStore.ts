import { makeAutoObservable } from 'mobx';

export class CategoryStore {
  selectedCategory: string = '전체';

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedCategory = (newCategory: string) => {
    this.selectedCategory = newCategory;
  };
}
