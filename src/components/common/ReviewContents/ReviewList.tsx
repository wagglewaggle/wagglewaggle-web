import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { ReviewDetailType, ReviewType } from 'types/typeBundle';
import { palette, locationNames } from 'constants/';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import ReviewCard from './ReviewCard';

interface PropsType {
  reviews: ReviewType[];
  shouldIncludeOnClick?: boolean;
}

const ReviewList = (props: PropsType) => {
  const { reviews, shouldIncludeOnClick } = props;
  const { pathname } = useLocation();
  const { ReviewStore, LocationStore } = useStore().MobxStore;
  const { locationData } = LocationStore;
  const placeName = locationNames[locationData?.name ?? ''] || (locationData?.name ?? '');

  const getReviewDetail = async (type: string, placeIdx: string, postIdx: string) => {
    const response = await axiosRequest('get', `${type}/${placeIdx}/review-post/${postIdx}`);
    if (!response?.data) return;
    ReviewStore.setReviewDetail(response.data as ReviewDetailType);
  };

  useEffect(() => {
    const [, , placeIdx, type, postIdx] = pathname.split('/');
    if (!type || !postIdx) {
      ReviewStore.initReviewDetail();
      return;
    }
    getReviewDetail(type, placeIdx, postIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReviewStore, pathname]);

  useEffect(() => {
    ReviewStore.setHeaderTitleStatus({ visible: true, title: `${placeName} 실시간 리뷰` });
  }, [ReviewStore, placeName]);

  return (
    <ReviewsWrap shouldIncludeOnClick={shouldIncludeOnClick}>
      {reviews.length === 0 ? (
        <NoReviewWrap>
          <NoReviewHeader>작성된 리뷰가 없어요.</NoReviewHeader>
          <NoReviewContent>{`지금 해당 장소에 계시다면\r\n첫번째 리뷰를 남겨주세요 🥰`}</NoReviewContent>
        </NoReviewWrap>
      ) : (
        <>
          {reviews.map((review: ReviewType) => (
            <ReviewCard
              key={`review-${review.idx}`}
              review={review}
              shouldIncludeOnClick={shouldIncludeOnClick}
            />
          ))}
        </>
      )}
    </ReviewsWrap>
  );
};

export default observer(ReviewList);

const ReviewsWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'shouldIncludeOnClick',
})<{ shouldIncludeOnClick?: boolean }>(({ shouldIncludeOnClick }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  cursor: shouldIncludeOnClick ? 'pointer' : 'auto',
}));

const NoReviewWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 24px',
  marginTop: 16,
  gap: 8,
});

const NoReviewHeader = styled('span')({
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const NoReviewContent = styled('span')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
});
