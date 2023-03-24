import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, Divider, styled } from '@mui/material';
import { useStore } from 'stores';
import ReviewDetailInput from './ReviewDetailInput';
import { ReviewCard, ReplyCard, CustomHeader } from 'components/common';
import { ReviewDetailType, PlaceDataType, CategoryType, ReplyType } from 'types/typeBundle';
import { palette, symbolsComponents } from 'constants/';
import { getImageSymbol } from 'util/';

const ReviewDetail = () => {
  const [symbol, setSymbol] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { ReviewStore, LocationStore } = useStore().MobxStore;
  const { reviewDetail } = ReviewStore;
  const { placesData } = LocationStore;
  const primaryCategories: string[] = useMemo(() => ['한강', '공원', '궁궐'], []);
  const placeName = searchParams.get('name');

  const handleCloseDrawer = () => {
    ReviewStore.setReviewDetail(null);
  };

  useEffect(() => {
    ReviewStore.setWriteReviewButtonVisible(false);
    ReviewStore.setHeaderTitleStatus({ visible: false });
    ReviewStore.setReplyStatus({ writeMode: false });
  }, [ReviewStore]);

  useEffect(() => {
    const placeCategories = placesData
      .find((data: PlaceDataType) => data.name === placeName)
      ?.categories?.map((category: CategoryType) => category.type);
    setSymbol(getImageSymbol(placeCategories ?? []) ?? '');
  }, [placesData, placeName, primaryCategories]);

  return (
    <ReviewDetailDrawer
      open={!!ReviewStore.reviewDetail}
      anchor='right'
      onClose={handleCloseDrawer}
    >
      <CustomHeader />
      <BlankArea />
      <PlaceTag>
        {symbolsComponents[symbol] ?? ''}
        {placeName}
      </PlaceTag>
      <ReviewCard review={reviewDetail as ReviewDetailType} isDetail />
      <CustomDivider />
      {(reviewDetail?.replies ?? []).map((reply: ReplyType, idx: number) => (
        <ReplyCard
          key={`reply-card-${reply.idx}`}
          shortened
          reply={reply}
          isLast={idx === (reviewDetail?.replies.length ?? 0) - 1}
        />
      ))}
      {ReviewStore.replyStatus.writeMode && <ReviewDetailInput />}
    </ReviewDetailDrawer>
  );
};

export default observer(ReviewDetail);

const ReviewDetailDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: 430,
  },
});

const BlankArea = styled('div')({
  marginTop: 49,
});

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

const CustomDivider = styled(Divider)({
  border: `3px solid ${palette.grey[200]}`,
});
