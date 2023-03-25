import { makeAutoObservable } from 'mobx';
import axiosRequest from 'api/axiosRequest';
import { ReviewType, ReviewDetailType, ReplyType } from 'types/typeBundle';

type HeaderTitleStatusType = {
  visible: boolean;
  title: string;
};

type ReplyStatusType = {
  writeMode: boolean;
  replyIdx?: number;
};

type EditOptionsType = {
  editMode: boolean;
  content: string;
};

export class ReviewStore {
  reviews: ReviewType[] = [];
  reviewDetail: ReviewDetailType | null = null;
  selectedReply: ReplyType | null = null;
  writeReviewButtonVisible: boolean = false;
  headerTitleStatus: HeaderTitleStatusType = { visible: true, title: '' };
  replyStatus: ReplyStatusType = { writeMode: false };
  editReviewOptions: EditOptionsType = {
    editMode: false,
    content: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  setReviews = (reviews: ReviewType[]) => {
    this.reviews = reviews;
  };

  setEditOptions = (newEditMode: EditOptionsType) => {
    this.editReviewOptions = newEditMode;
  };

  initReviews = async (requestType: 'SKT' | 'KT', placeIdx: number | string) => {
    const response = await axiosRequest('get', `${requestType}/${placeIdx}/review-post`);
    this.setReviews(response?.data.list);
  };

  setReviewDetail = (newReview: ReviewDetailType | null) => {
    this.reviewDetail = newReview;
  };

  initReviewDetail = async (
    placeType: 'SKT' | 'KT',
    placeIdx: number | string,
    reviewIdx: number | string
  ) => {
    const response = await axiosRequest('get', `${placeType}/${placeIdx}/review-post/${reviewIdx}`);
    this.setReviewDetail(response?.data as ReviewDetailType);
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
