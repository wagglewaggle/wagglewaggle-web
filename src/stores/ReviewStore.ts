import { makeAutoObservable } from 'mobx';
import { ReviewType, ReviewDetailType, ReplyType } from 'types/typeBundle';

type HeaderTitleStatusType = {
  visible: boolean;
  title: string;
};

type ReplyStatusType = {
  writeMode: boolean;
  replyIdx?: number;
};

export class ReviewStore {
  reviews: ReviewType[] = [];
  reviewDetail: ReviewDetailType | null = null;
  selectedReply: ReplyType | null = null;
  writeReviewButtonVisible: boolean = false;
  headerTitleStatus: HeaderTitleStatusType = { visible: true, title: '' };
  replyStatus: ReplyStatusType = { writeMode: false };

  constructor() {
    makeAutoObservable(this);
  }

  setReviews = (reviews: ReviewType[]) => {
    this.reviews = reviews;
  };

  setReviewDetail = (newReview: ReviewDetailType | null) => {
    this.reviewDetail = newReview;
  };

  setSelectedReply = (newSelectedReply: ReplyType | null) => {
    this.selectedReply = newSelectedReply;
  };

  setWriteReviewButtonVisible = (newStatus: boolean) => {
    this.writeReviewButtonVisible = newStatus;
  };

  setHeaderTitleStatus = (newStatus: Partial<HeaderTitleStatusType>) => {
    this.headerTitleStatus = { ...this.headerTitleStatus, ...newStatus };
  };

  setReplyStatus = (newStatus: ReplyStatusType) => {
    this.replyStatus = newStatus;
  };
}
