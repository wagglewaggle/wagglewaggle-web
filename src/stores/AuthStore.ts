import { makeAutoObservable } from 'mobx';
import axiosRequest from 'api/axiosRequest';
import { FavoritesType, FavoritePlaceType } from 'types/typeBundle';

export class AuthStore {
  authorized: boolean = false;
  isLoggingIn: boolean = false;
  favorites: FavoritesType = { places: [] };
  autoLoginChecked: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setFavorites = (favorites: FavoritesType) => {
    this.favorites = favorites;
  };

  setUserFavorites = (favorites: FavoritePlaceType[]) => {
    this.favorites.places = favorites;
  };

  initializeFavorites = async () => {
    const { data } = (await axiosRequest('get', 'pin-place')) as { data: FavoritesType };
    this.setFavorites(data);
  };

  setAuthorized = (newStatus: boolean) => {
    this.authorized = newStatus;
  };

  initAutoLoginChecked = () => {
    this.autoLoginChecked = false;
  };

  setAutoLoginChecked = () => {
    this.autoLoginChecked = !this.autoLoginChecked;
    if (!this.autoLoginChecked) return;
    sessionStorage.setItem('@wagglewaggle_auto_login_checked', 'true');
  };

  setIsLoggingIn = (newStatus: boolean) => {
    this.isLoggingIn = newStatus;
  };

  logout = () => {
    this.authorized = false;
    this.favorites = { places: [] };
    localStorage.clear();
  };
}
