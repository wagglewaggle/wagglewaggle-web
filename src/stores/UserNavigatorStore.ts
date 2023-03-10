import { makeAutoObservable } from 'mobx';

export class UserNavigatorStore {
  userLocation: number[] = [37.625638, 127.038941];
  dataLocation: number[] = [37.625638, 127.038941];
  loaded: boolean = false;
  isUserLocation: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserLocation = (newUserLocation: number[], shouldUpdate: boolean) => {
    this.userLocation = newUserLocation;
    if (shouldUpdate) {
      this.dataLocation = newUserLocation;
      this.isUserLocation = true;
    }
  };

  setDataLocation = (newDataLocation: number[]) => {
    this.dataLocation = newDataLocation;
    this.isUserLocation = false;
  };

  setLoaded = (newStatus: boolean) => {
    this.loaded = newStatus;
  };
}
