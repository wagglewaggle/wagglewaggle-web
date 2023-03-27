import { useEffect, useCallback } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { ReviewList } from 'components/common';
import { CustomIconButton } from 'components/common/HeaderContents/common';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType } from 'types/typeBundle';
import { initPlaceData } from 'util/';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

const Review = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { LocationStore, ReviewStore, ThemeStore, AuthStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const placeName = searchParams.get('name') ?? '';
  const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(
    locationNames[placeName] || placeName
  )
    ? 'SKT'
    : 'KT';

  const getReviews = useCallback(async () => {
    const pathnameArr = pathname.split('/');
    const placeIdx = pathnameArr[pathnameArr.length - 1];
    if (!requestType || !placeIdx || pathnameArr.length > 3) return;
    ReviewStore.initReviews(requestType, placeIdx);
  }, [ReviewStore, requestType, pathname]);

  const handleReviewClose = () => {
    navigate(
      `/map/detail/${LocationStore.locationData?.idx}?name=${LocationStore.locationData?.name}`
    );
  };

  const initLocationData = useCallback(async () => {
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
    if (LocationStore.placesData.length !== 0 || !AuthStore.authorized) return;
    initPlaceData();
  }, [AuthStore.authorized, LocationStore.placesData.length]);

  useEffect(() => {
    document.body.setAttribute('style', `overflow-y:auto`);
  }, [pathname]);

  useEffect(() => {
    sessionStorage.setItem('@wagglewaggle_intro_popup_open', 'false');
  }, []);

  useEffect(() => {
    if (ReviewStore.reviews.length > 0) return;
    getReviews();
  }, [ReviewStore, getReviews]);

  return (
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
