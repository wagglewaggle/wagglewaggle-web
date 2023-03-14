import { makeAutoObservable } from 'mobx';
import { ReviewType } from 'types/typeBundle';

export class ReviewStore {
  reviews: ReviewType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setReviews = (reviews: ReviewType[]) => {
    this.reviews = reviews;
  };
}
