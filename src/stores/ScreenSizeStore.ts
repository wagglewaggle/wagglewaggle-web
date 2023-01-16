import { makeAutoObservable } from 'mobx';
import { ScreenType } from 'types/typeBundle';

export class ScreenSizeStore {
  screenWidth: number = 0;
  screenType: ScreenType = 'mobile';

  constructor() {
    makeAutoObservable(this);
  }

  setScreenWidth = (newWidth: number) => {
    this.screenWidth = newWidth;
  };

  setScreenType = (newType: ScreenType) => {
    this.screenType = newType;
  };
}
