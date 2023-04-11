import { useEffect, useCallback } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import { ReviewList } from 'components/common';
import { CustomIconButton } from 'components/common/HeaderContents/common';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType, RequestType, ReplyType } from 'types/typeBundle';
import { initPlaceData } from 'util/';
import { palette } from 'constants/';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

const Review = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { LocationStore, ReviewStore, ThemeStore, AuthStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const { placesData, locationData } = LocationStore;
  const { reviewDetail, selectedReply } = ReviewStore;
  const placeName = searchParams.get('name') ?? '';
  const requestType: RequestType | undefined = placesData.find(
    (data) => data.name === placeName
  )?.type;

  const getReviews = useCallback(async () => {
    const pathnameArr = pathname.split('/');
    const placeIdx = pathnameArr[pathnameArr.length - 1];
    if (!requestType || !placeIdx || pathnameArr.length > 3) return;
    ReviewStore.initReviews(requestType, placeIdx);
  }, [ReviewStore, requestType, pathname]);

  const handleReviewClose = useCallback(() => {
    navigate(`/map/detail/${locationData?.idx}?name=${locationData?.name}`);
    ReviewStore.setReviewDetail(null);
    ReviewStore.setSelectedReply(null);
  }, [navigate, locationData, ReviewStore]);

  const initLocationData = useCallback(async () => {
    if (!requestType) return;
    const pathnameArr = pathname.split('/');
    LocationStore.setPlaceName(placeName);
    const placeIdx = pathnameArr[pathnameArr.length - 1];
    const response: { data: LocationDataType } | undefined = await axiosRequest(
      'get',
      `place/${requestType}/${placeIdx}`
    );
    if (!response) return;
    const { data } = response;
    LocationStore.setLocationData(data);
  }, [LocationStore, pathname, placeName, requestType]);

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    if (pathnameArr.length > 3) return;
    initLocationData();
  }, [initLocationData, pathname]);

  useEffect(() => {
    if (placesData.length !== 0 || !AuthStore.authorized) return;
    initPlaceData();
  }, [AuthStore.authorized, placesData.length]);

  useEffect(() => {
    document.body.setAttribute('style', `overflow-y:auto`);
  }, [pathname]);

  useEffect(() => {
    ReviewStore.setWriteReviewButtonVisible(true);
  }, [ReviewStore]);

  useEffect(() => {
    if (ReviewStore.reviews.length > 0) return;
    getReviews();
  }, [ReviewStore, getReviews]);

  useEffect(() => {
    if (!!ReviewStore.reviewDetail || !!ReviewStore.selectedReply) return;
    window.onpopstate = handleReviewClose;
  }, [handleReviewClose, ReviewStore.reviewDetail, ReviewStore.selectedReply]);

  useEffect(() => {
    if (!!reviewDetail || !searchParams.get('reviewIdx') || !requestType) return;
    const pathnameArr = pathname.split('/');
    const placeIdx = pathnameArr[pathnameArr.length - 1];
    ReviewStore.initReviewDetail(requestType, placeIdx, searchParams.get('reviewIdx') as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestType]);

  useEffect(() => {
    if (!!selectedReply || !reviewDetail || !searchParams.get('replyIdx')) return;
    ReviewStore.setSelectedReply(
      reviewDetail.replies.find(
        (reply: ReplyType) => String(reply.idx) === searchParams.get('replyIdx')
      ) ?? null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewDetail]);

  return (
    <ReviewDrawer
      open={pathname.split('/').includes('review')}
      anchor='right'
      transitionDuration={0}
    >
      <Wrap isDarkTheme={isDarkTheme}>
        <SubHeader>
          <CustomIconButton onClick={handleReviewClose}>
            <LeftIcon />
          </CustomIconButton>
          {ReviewStore.headerTitleStatus.title}
        </SubHeader>
        <BlankArea />
        <ReviewList reviews={ReviewStore.reviews} shouldIncludeOnClick />
      </Wrap>
    </ReviewDrawer>
  );
};

export default observer(Review);

const ReviewDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: 430,
  },
});

export const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'auto',
  minHeight: '100vh',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  zIndex: 100,
}));

const BlankArea = styled('div')({
  width: '100%',
  height: 48,
  minHeight: 48,
});

const SubHeader = styled('div')({
  position: 'fixed',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '0 24px',
  width: 'calc(100% - 48px)',
  maxWidth: 382,
  height: 48,
  minHeight: 48,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  backgroundColor: palette.white,
  gap: 8,
  zIndex: 10,
});
