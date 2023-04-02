import { makeAutoObservable } from 'mobx';
import { FavoritePlaceType, PinnedReviewType, MyReplyType, ReviewType } from 'types/typeBundle';

type FavPlacesType = { requested: boolean; data: FavoritePlaceType[] };
type FavReviewsType = { requested: boolean; data: PinnedReviewType[] };
type MyPlacesType = { requested: boolean; data: ReviewType[] };
type MyRepliesType = { requested: boolean; data: MyReplyType[] };

export class ProfileStore {
  userNickname: string = '';
  profilePageOpen: boolean = false;
  editPageOpen: boolean = false;
  favoritesPageOpen: boolean = false;
  myPostsPageOpen: boolean = false;
  termsPageOpen: boolean = false;
  pageListTab: 'place' | 'review' = 'place';
  favPlaces: FavPlacesType = { requested: false, data: [] };
  favReviews: FavReviewsType = { requested: false, data: [] };
  myPlaces: MyPlacesType = { requested: false, data: [] };
  myReplies: MyRepliesType = { requested: false, data: [] };

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

  setMyPostsPageOpen = (status: boolean) => {
    this.myPostsPageOpen = status;
  };

  setPageListTab = (newTab: 'place' | 'review') => {
    this.pageListTab = newTab;
  };

  setTermsPageOpen = (status: boolean) => {
    this.termsPageOpen = status;
  };

  setFavPlaces = (requestStatus: boolean, newData: FavoritePlaceType[]) => {
    this.favPlaces.requested = requestStatus;
    this.favPlaces.data = newData;
  };

  setFavReviews = (requestStatus: boolean, newData: PinnedReviewType[]) => {
    this.favReviews.requested = requestStatus;
    this.favReviews.data = newData;
  };

  setMyPlaces = (requestStatus: boolean, newData: ReviewType[]) => {
    this.myPlaces.requested = requestStatus;
    this.myPlaces.data = newData;
  };

  setMyReplies = (requestStatus: boolean, newData: MyReplyType[]) => {
    this.myReplies.requested = requestStatus;
    this.myReplies.data = newData;
  };
}
