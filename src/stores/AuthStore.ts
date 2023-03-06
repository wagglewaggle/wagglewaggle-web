import { makeAutoObservable } from 'mobx';
import axiosRequest from 'api/axiosRequest';

export class AuthStore {
  authorized: boolean = false;
  isLoggingIn: boolean = false;
  refreshUserTimeout: null | NodeJS.Timeout = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAuthorized = (newStatus: boolean) => {
    this.authorized = newStatus;
    if (this.authorized) {
      if (this.refreshUserTimeout) {
        clearTimeout(this.refreshUserTimeout);
      }
      this.refreshUserTimeout = setTimeout(async () => {
        try {
          const response = await axiosRequest('post', 'auth/reissue', {
            refreshToken: localStorage.getItem('@wagglewaggle_refresh_token'),
          });
          if (!response) throw Error;
        } catch (e) {
          this.authorized = false;
          localStorage.removeItem('@wagglewaggle_access_token');
          localStorage.removeItem('@wagglewaggle_refresh_token');
        }
      }, 1740000);
    }
  };

  setIsLoggingIn = (newStatus: boolean) => {
    this.isLoggingIn = newStatus;
  };
}
