import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { CustomHeader, ReviewList } from 'components/common';
import ReviewDetail from './ReviewDetail';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes } from 'constants/';

const Review = () => {
  const { pathname, search } = useLocation();
  const { LocationStore, ReviewStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const pathnameArr = pathname.split('/');
  const placeName = decodeURI(search).replace('?name=', '');
  const placeIdx = pathnameArr[pathnameArr.length - 1];
  const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(
    locationNames[placeName] || placeName
  )
    ? 'SKT'
    : 'KT';

  const getReviews = async () => {
    if (!requestType || !placeIdx) return;
    const response = await axiosRequest('get', `${requestType}/${placeIdx}/review-post`);
    ReviewStore.setReviews(response?.data.list);
  };

  const initLocationData = async () => {
    LocationStore.setPlaceName(placeName);
    const response: { data: LocationDataType } | undefined = await axiosRequest(
      'get',
      `place/${requestType}/${placeIdx}`
    );
    if (!response) return;
    const { data } = response;
    LocationStore.setLocationData(data);
  };

  useEffect(() => {
    initLocationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.setAttribute('style', `overflow-y:auto`);
  }, [pathname]);

  useEffect(() => {
    if (ReviewStore.reviews.length > 0) return;
    getReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ReviewStore]);

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
