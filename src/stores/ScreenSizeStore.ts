import { makeAutoObservable } from 'mobx';
import { screenType } from 'types/typeBundle';

export class ScreenSizeStore {
  screenWidth: number = 0;
  screenType: screenType = 'mobile';

  constructor() {
    makeAutoObservable(this);
  }

  setScreenWidth = (newWidth: number) => {
    this.screenWidth = newWidth;
  };

  setScreenType = (newType: screenType) => {
    this.screenType = newType;
  };
}
