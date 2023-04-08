import { makeAutoObservable } from 'mobx';

export class UserNavigatorStore {
  deepLinkUrl: string | null = null;
  userLocation: number[] = [37.49852498844754, 127.02851772308351];
  dataLocation: number[] = [37.49852498844754, 127.02851772308351];
  loaded: boolean = false;
  isUserLocation: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setDeepLinkUrl = (url: string) => {
    this.deepLinkUrl = url;
  };

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
