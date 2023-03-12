import { makeAutoObservable } from 'mobx';
import axiosRequest from 'api/axiosRequest';
import { FavoritesType, FavoritePlaceType } from 'types/typeBundle';

export class AuthStore {
  authorized: boolean = false;
  isLoggingIn: boolean = false;
  refreshUserTimeout: null | NodeJS.Timeout = null;
  favorites: FavoritesType = { ktPlaces: [], sktPlaces: [] };

  constructor() {
    makeAutoObservable(this);
  }

  setFavorites = (favorites: FavoritesType) => {
    this.favorites = favorites;
  };

  setUserFavorites = (type: 'KT' | 'SKT', favorites: FavoritePlaceType[]) => {
    this.favorites[`${type.toLowerCase() as 'kt' | 'skt'}Places`] = favorites;
  };

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
          this.logout();
        }
      }, 1740000);
    }
  };

  setIsLoggingIn = (newStatus: boolean) => {
    this.isLoggingIn = newStatus;
  };

  logout = () => {
    this.authorized = false;
    this.favorites = { ktPlaces: [], sktPlaces: [] };
    localStorage.clear();
  };
}
