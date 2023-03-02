import { makeAutoObservable } from 'mobx';

export class UserNavigatorStore {
  currentLocation: number[] = [37.625638, 127.038941];
  loaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUserLocation = (newUserLocation: number[]) => {
    this.currentLocation = newUserLocation;
  };

  setLoaded = (newStatus: boolean) => {
    this.loaded = newStatus;
  };
}
