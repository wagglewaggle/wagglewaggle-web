import { makeAutoObservable } from 'mobx';
import _ from 'lodash';

export class CategoryStore {
  categoryList: string[] = [
    '강변',
    '봄 나들이',
    '골목 및 거리',
    '공원',
    '궁궐',
    '마을',
    '쇼핑몰',
    '지하철',
    '테마파크',
    '해변',
    '기타 지역',
  ];
  selectedCategories: '전체' | string[] = '전체';

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedCategory = (clickedCategory: '전체' | string) => {
    const isPrevValueAll = this.selectedCategories === '전체';
    if (clickedCategory === '전체') {
      this.selectedCategories = isPrevValueAll ? [] : '전체';
      return;
    }
    const newCategories = _.cloneDeep(isPrevValueAll ? [] : this.selectedCategories) as string[];
    const categoryIdx = newCategories.indexOf(clickedCategory);
    categoryIdx !== -1 ? newCategories.splice(categoryIdx, 1) : newCategories.push(clickedCategory);
    this.selectedCategories =
      newCategories.length === this.categoryList.length ? '전체' : newCategories;
  };
}
