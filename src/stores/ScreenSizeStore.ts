import { makeAutoObservable } from 'mobx';
import { ScreenType } from 'types/typeBundle';

export class ScreenSizeStore {
  screenWidth: number = 0;
  screenHeight: number = 0;
  screenType: ScreenType = 'mobile';

  constructor() {
    makeAutoObservable(this);
  }

  setScreenSize = (newWidth: number, newHeight: number) => {
    this.screenWidth = newWidth;
    this.screenHeight = newHeight;
  };

  setScreenType = (newType: ScreenType) => {
    this.screenType = newType;
  };
}
