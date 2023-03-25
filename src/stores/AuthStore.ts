import { makeAutoObservable } from 'mobx';
import axiosRequest from 'api/axiosRequest';
import { FavoritesType, PinnedReviewType } from 'types/typeBundle';

export class AuthStore {
  authorized: boolean = false;
  isLoggingIn: boolean = false;
  favorites: FavoritesType = { places: [] };
  pinnedReviews: PinnedReviewType[] = [];
  autoLoginChecked: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setFavorites = (favorites: FavoritesType) => {
    this.favorites = favorites;
  };

  setPinnedReviews = (reviews: PinnedReviewType[]) => {
    this.pinnedReviews = reviews;
  };

  initializeFavorites = async () => {
    const { data } = (await axiosRequest('get', 'pin-place')) as { data: FavoritesType };
    this.setFavorites(data);
  };

  initializePinnedReviews = async () => {
    const { data } = (await axiosRequest('get', 'pin-review-post')) as {
      data: { list: PinnedReviewType[] };
    };
    this.setPinnedReviews(data.list);
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
    sessionStorage.clear();
  };
}
