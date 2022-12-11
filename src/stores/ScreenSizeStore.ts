import { makeAutoObservable } from 'mobx';

export class ScreenSizeStore {
  currentWidth: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setCurrentWidth = (newWidth: number) => {
    this.currentWidth = newWidth;
  };
}
