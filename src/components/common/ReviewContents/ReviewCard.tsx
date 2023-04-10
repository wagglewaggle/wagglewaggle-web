import { MouseEvent } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import ReviewCardHeader from './ReviewCardHeader';
import { palette, symbolsComponents, locationNames } from 'constants/';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { ReviewType, PinnedReviewType, RequestType } from 'types/typeBundle';
import { reviewStrConstants } from 'constants/';
import { filterBadWords } from 'util/';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  review: ReviewType;
  shouldIncludeOnClick?: boolean;
  isDetail?: boolean;
  disableBottom?: boolean;
  fromProfile?: boolean;
  tagData?: {
    symbol: string;
    placeName: string | null;
  };
}

const ReviewCard = (props: PropsType) => {
  const { review, shouldIncludeOnClick, isDetail, disableBottom, fromProfile, tagData } = props;
  const [searchParams] = useSearchParams();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { ReviewStore, AuthStore, CustomDialogStore } = useStore().MobxStore;
  const {
    writer,
    status,
    createdDate,
    content,
    pinReviewPostCount,
    replyCount,
    place,
    isPin,
    idx,
  } = review;
  const {
    deleted,
    deactivated,
    locked,
    reportDeleted,
    maskedUserNickname,
    deleteMaskedReview,
    reportMaskedReview,
  } = reviewStrConstants;
  const isDeleted = status === deleted;
  const isReported = status === reportDeleted;
  const isUserMasked = [deactivated, locked].includes(writer.status);

  const getReviewDetail = async (type: string, placeIdx: number | string, postIdx: number) => {
    await ReviewStore.initReviewDetail(type as RequestType, placeIdx, postIdx);
  };

  const removeReviewDetail = () => {
    ReviewStore.setReviewDetail(null);
    CustomDialogStore.setOpen(false);
  };

  const checkReviewDetailStatus = () => {
    if ([deleted, reportDeleted].includes(ReviewStore.reviewDetail?.status as string)) {
      const isDeleted = ReviewStore.reviewDetail?.status === deleted;
      CustomDialogStore.openNotificationDialog({
        title: isDeleted ? '삭제 게시물' : '신고차단 게시물',
        content: isDeleted
          ? '해당 게시물은 삭제된 게시물입니다.'
          : '신고를 받아 차단된 게시물입니다.',
        rightButton: {
          title: '확인',
          handleClick: removeReviewDetail,
        },
      });
      return false;
    }
    return true;
  };

  const handleClick = async () => {
    if (!shouldIncludeOnClick) return;
    const pathnameArr = pathname.split('/');
    await getReviewDetail(
      place.type,
      fromProfile ? place.idx : pathnameArr[pathnameArr.length - 1],
      idx
    );
    if (!checkReviewDetailStatus()) return;
    if (!pathname.includes('review')) {
      navigate(`${pathname.replace('map/detail', 'review')}${search}`);
    }
    if (!searchParams.get('reviewIdx')) {
      navigate(
        `${pathname.replace('map/detail', 'review')}${search}${search ? '&' : '?'}reviewIdx=${
          ReviewStore.reviewDetail?.idx ?? ''
        }`
      );
    }
  };

  const handlePinReviewClick = async (e: MouseEvent) => {
    e.stopPropagation();
    const response = isPin
      ? await axiosRequest('delete', 'pin-review-post', {
          idx: AuthStore.pinnedReviews.find(
            (review: PinnedReviewType) => review.reviewPost.idx === idx
          )?.idx,
        })
      : await axiosRequest('post', 'pin-review-post', { idx });
    if (!response?.data) return;
    ReviewStore.initReviews(place.type as RequestType, place.idx);
    ReviewStore.reviewDetail &&
      ReviewStore.initReviewDetail(place.type as RequestType, place.idx, idx);
    AuthStore.initializePinnedReviews();
  };

  return (
    <>
      {tagData && (
        <PlaceTag>
          {symbolsComponents[tagData.symbol] ?? ''}
          {locationNames?.[tagData.placeName ?? ''] ?? tagData.placeName ?? ''}
        </PlaceTag>
      )}
      <ReviewWrap isDetail={isDetail} disableBottom={disableBottom} onClick={handleClick}>
        <ReviewCardHeader
          replyContent={filterBadWords(content)}
          profilePhoto={defaultPhoto}
          userNickname={
            isDeleted || isReported || isUserMasked ? maskedUserNickname : writer.nickname
          }
          createdDate={createdDate}
          requestUrl={`${place.type}/${place.idx}/review-post/${idx}`}
          removeOptions
        />
        <ReviewContent isDetail={isDetail}>
          {isDeleted
            ? deleteMaskedReview
            : isReported
            ? reportMaskedReview
            : filterBadWords(content)}
        </ReviewContent>
        {!isDeleted && !isReported && (
          <IconsInfoWrap>
            <IconsWrap isPinned={isPin} onClick={handlePinReviewClick}>
              <HeartIcon /> {String(pinReviewPostCount).padStart(2, '0')}
            </IconsWrap>
            <IconsWrap>
              <ChatIcon /> {String(replyCount).padStart(2, '0')}
            </IconsWrap>
          </IconsInfoWrap>
        )}
      </ReviewWrap>
    </>
  );
};

export default observer(ReviewCard);

const PlaceTag = styled('div')({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
  padding: 4,
  margin: '20px 24px 0',
  width: 'fit-content',
  height: 16,
  backgroundColor: 'rgba(96, 92, 255, 0.2)',
  color: palette.violet,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  '& svg': {
    width: 16,
    height: 16,
  },
  '& rect': {
    fill: palette.violet,
  },
  '& path': {
    fill: palette.white,
  },
});

const ReviewWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isDetail', 'disableBottom'].includes(prop),
})<{ isDetail?: boolean; disableBottom?: boolean }>(({ isDetail, disableBottom }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: isDetail || disableBottom ? 'none' : `1px solid ${palette.grey[300]}`,
  padding: `${isDetail ? 16 : 20}px 24px 20px`,
  width: 'calc(100% - 48px)',
  gap: isDetail ? 16 : '8pt',
}));

const ReviewContent = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDetail',
})<{ isDetail?: boolean }>(({ isDetail }) => ({
  display: '-webkit-box',
  width: '100%',
  maxHeight: isDetail ? 'none' : 60,
  height: 'auto',
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  overflow: isDetail ? 'unset' : 'hidden',
  textOverflow: isDetail ? 'unset' : 'ellipsis',
  whiteSpace: 'pre-wrap',
  WebkitLineClamp: isDetail ? 'unset' : 3,
  WebkitBoxOrient: isDetail ? 'unset' : 'vertical',
}));

const IconsInfoWrap = styled('div')({
  display: 'flex',
  gap: 12,
});

const IconsWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isPinned',
})<{ isPinned?: boolean }>(({ isPinned }) => ({
  display: 'flex',
  color: palette.grey[400],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  cursor: 'pointer',
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));
