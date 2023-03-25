import { makeAutoObservable } from 'mobx';

export class ProfileStore {
  userNickname: string = '';
  profilePageOpen: boolean = false;
  editPageOpen: boolean = false;
  favoritesPageOpen: boolean = false;
  favoritesTab: 'place' | 'post' = 'place';

  constructor() {
    makeAutoObservable(this);
  }

  setUserNickname = (newNickname: string) => {
    this.userNickname = newNickname;
  };

  setProfilePageOpen = (status: boolean) => {
    this.profilePageOpen = status;
  };

  setEditPageOpen = (status: boolean) => {
    this.editPageOpen = status;
  };

  setFavoritesPageOpen = (status: boolean) => {
    this.favoritesPageOpen = status;
  };

  setFavoritesTab = (newTab: 'place' | 'post') => {
    this.favoritesTab = newTab;
  };
}
