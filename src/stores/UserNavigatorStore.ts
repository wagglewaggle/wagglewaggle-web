import { makeAutoObservable } from 'mobx';

export class UserNavigatorStore {
  currentLocation: number[] = [37.625638, 127.038941];
  loaded: boolean = false;
  isUserLocation: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserLocation = (newUserLocation: number[], isUserLocation: boolean) => {
    this.currentLocation = newUserLocation;
    this.isUserLocation = isUserLocation;
  };

  setLoaded = (newStatus: boolean) => {
    this.loaded = newStatus;
  };
}
