import { useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { CustomHeader, ReviewList } from 'components/common';
import ReviewDetail from './ReviewDetail';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType } from 'types/typeBundle';
import { initPlaceData } from 'util/';
import { palette, locationNames, locationRequestTypes } from 'constants/';

const Review = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { LocationStore, ReviewStore, ThemeStore, AuthStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const pathnameArr = pathname.split('/');
  const placeName = searchParams.get('name') ?? '';
  const placeIdx = pathnameArr[pathnameArr.length - 1];
  const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(
    locationNames[placeName] || placeName
  )
    ? 'SKT'
    : 'KT';

  const getReviews = useCallback(async () => {
    if (!requestType || !placeIdx) return;
    const response = await axiosRequest('get', `${requestType}/${placeIdx}/review-post`);
    ReviewStore.setReviews(response?.data.list);
  }, [ReviewStore, placeIdx, requestType]);

  const initLocationData = useCallback(async () => {
    LocationStore.setPlaceName(placeName);
    const response: { data: LocationDataType } | undefined = await axiosRequest(
      'get',
      `place/${requestType}/${placeIdx}`
    );
    if (!response) return;
    const { data } = response;
    LocationStore.setLocationData(data);
  }, [LocationStore, placeName, placeIdx, requestType]);

  useEffect(() => {
    initLocationData();
  }, [initLocationData]);

  useEffect(() => {
    if (LocationStore.placesData.length !== 0 || !AuthStore.authorized) return;
    initPlaceData();
  }, [AuthStore.authorized, LocationStore.placesData.length]);

  useEffect(() => {
    document.body.setAttribute('style', `overflow-y:auto`);
  }, [pathname]);

  useEffect(() => {
    if (ReviewStore.reviews.length > 0) return;
    getReviews();
  }, [ReviewStore, getReviews]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CustomHeader />
      <BlankArea />
      {ReviewStore.reviewDetail ? (
        <ReviewDetail />
      ) : (
        <ReviewList reviews={ReviewStore.reviews} shouldIncludeOnClick />
      )}
    </Wrap>
  );
};

export default observer(Review);

export const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'auto',
  minHeight: '100vh',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  boxShadow: '0px -10px 40px rgb(0 0 0 / 30%)',
  zIndex: 100,
}));

const BlankArea = styled('div')({
  width: '100%',
  height: 48,
});
