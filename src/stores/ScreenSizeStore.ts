import { makeAutoObservable } from 'mobx';
import { screenType } from 'types/typeBundle';

export class ScreenSizeStore {
  screenType: screenType = 'mobile';

  constructor() {
    makeAutoObservable(this);
  }

  setScreenType = (newType: screenType) => {
    this.screenType = newType;
  };
}
