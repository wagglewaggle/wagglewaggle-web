import { makeAutoObservable } from 'mobx';
import { ReviewType, ReviewDetailType } from 'types/typeBundle';

export class ReviewStore {
  reviews: ReviewType[] = [];
  reviewDetail: ReviewDetailType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setReviews = (reviews: ReviewType[]) => {
    this.reviews = reviews;
  };

  setReviewDetail = (newReview: ReviewDetailType) => {
    this.reviewDetail = newReview;
  };

  initReviewDetail = () => {
    this.reviewDetail = null;
  };
}
