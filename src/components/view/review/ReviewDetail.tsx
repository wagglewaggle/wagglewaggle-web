import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, Divider, styled } from '@mui/material';
import { useStore } from 'stores';
import ReviewDetailInput from './ReviewDetailInput';
import { ReviewCard, ReplyCard } from 'components/common';
import { ReviewHeader } from 'components/common/HeaderContents';
import { ReviewDetailType, PlaceDataType, CategoryType, ReplyType } from 'types/typeBundle';
import { palette } from 'constants/';
import { getImageSymbol } from 'util/';

const ReviewDetail = () => {
  const [symbol, setSymbol] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const { ReviewStore, LocationStore } = useStore().MobxStore;
  const { reviewDetail } = ReviewStore;
  const { placesData } = LocationStore;
  const primaryCategories: string[] = useMemo(() => ['강변', '공원', '궁궐'], []);
  const placeName = searchParams.get('name');
  const fromProfile = !pathname.split('/').includes('review');
  const selectedPlaceName = fromProfile && reviewDetail ? reviewDetail.place.name : placeName;

  const handleCloseDrawer = useCallback(() => {
    ReviewStore.setReviewDetail(null);
    ReviewStore.setReplyStatus({ writeMode: false });
    ReviewStore.setEditOptions({ editMode: false, content: '', requestUrl: '', type: 'review' });
    if (searchParams.get('reviewIdx')) {
      searchParams.delete('reviewIdx');
      setSearchParams(searchParams);
    }
  }, [ReviewStore, searchParams, setSearchParams]);

  useEffect(() => {
    ReviewStore.setHeaderTitleStatus({ visible: false });
    ReviewStore.setReplyStatus({ writeMode: false });
  }, [ReviewStore]);

  useEffect(() => {
    const placeCategories = placesData
      .find((data: PlaceDataType) => data.name === selectedPlaceName)
      ?.categories?.map((category: CategoryType) => category.type);
    setSymbol(getImageSymbol(placeCategories ?? []) ?? '');
  }, [reviewDetail, placesData, selectedPlaceName, primaryCategories]);

  useEffect(() => {
    if (!ReviewStore.reviewDetail) return;
    if (!!ReviewStore.selectedReply) return;
    if (searchParams.get('reviewIdx')) return;
    window.onpopstate = () => handleCloseDrawer();
  }, [handleCloseDrawer, ReviewStore.reviewDetail, ReviewStore.selectedReply, searchParams]);

  return (
    <ReviewDetailDrawer
      open={!!ReviewStore.reviewDetail}
      anchor='right'
      onClose={() => handleCloseDrawer()}
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <ReviewHeader
        isMyReview={
          sessionStorage.getItem('@wagglewaggle_user_nickname') === reviewDetail?.writer.nickname
        }
        handleCloseDrawer={() => handleCloseDrawer()}
        replyContent={reviewDetail?.content}
      />
      <BlankArea />
      {reviewDetail && (
        <ReviewCard
          review={reviewDetail as ReviewDetailType}
          isDetail
          tagData={{ symbol, placeName: selectedPlaceName }}
        />
      )}
      <CustomDivider />
      {(reviewDetail?.replies ?? []).map((reply: ReplyType, idx: number) => (
        <ReplyCard
          key={`reply-card-${reply.idx}`}
          shortened
          review={reviewDetail as ReviewDetailType}
          reply={reply}
          isLast={idx === (reviewDetail?.replies.length ?? 0) - 1}
        />
      ))}
      <ReviewDetailInput />
    </ReviewDetailDrawer>
  );
};

export default observer(ReviewDetail);

const ReviewDetailDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
  },
});

const BlankArea = styled('div')({
  marginTop: 49,
});

const CustomDivider = styled(Divider)({
  border: `3px solid ${palette.grey[200]}`,
});
