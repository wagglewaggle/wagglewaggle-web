import { makeAutoObservable } from 'mobx';
import axiosRequest from 'api/axiosRequest';
import { FavoritesType, FavoritePlaceType } from 'types/typeBundle';

export class AuthStore {
  authorized: boolean = false;
  isLoggingIn: boolean = false;
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

  initializeFavorites = async () => {
    if (!this.authorized) return;
    const { data } = (await axiosRequest('get', 'pin-place')) as { data: FavoritesType };
    this.setFavorites(data);
  };

  setAuthorized = (newStatus: boolean) => {
    this.authorized = newStatus;
    this.initializeFavorites();
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
