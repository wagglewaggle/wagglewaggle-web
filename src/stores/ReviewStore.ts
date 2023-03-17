import { makeAutoObservable } from 'mobx';
import { ReviewType, ReviewDetailType } from 'types/typeBundle';

type HeaderTitleStatusType = {
  visible: boolean;
  title: string;
};

export class ReviewStore {
  reviews: ReviewType[] = [];
  reviewDetail: ReviewDetailType | null = null;
  writeReviewButtonVisible: boolean = false;
  headerTitleStatus: HeaderTitleStatusType = { visible: true, title: '' };

  constructor() {
    makeAutoObservable(this);
  }

  setReviews = (reviews: ReviewType[]) => {
    this.reviews = reviews;
  };

  setReviewDetail = (newReview: ReviewDetailType) => {
    this.reviewDetail = newReview;
  };

  setWriteReviewButtonVisible = (newStatus: boolean) => {
    this.writeReviewButtonVisible = newStatus;
  };

  setHeaderTitleStatus = (newStatus: Partial<HeaderTitleStatusType>) => {
    this.headerTitleStatus = { ...this.headerTitleStatus, ...newStatus };
  };

  initReviewDetail = () => {
    this.reviewDetail = null;
  };
}
