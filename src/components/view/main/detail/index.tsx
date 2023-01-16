import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import DetailHeader from './DetailHeader';
import DetailedCongestion from './DetailedCongestion';
import LocationInformation from './LocationInformation';
import RelatedLocations from './RelatedLocations';
import { useStore } from 'stores';
import { LocationDataType, ScreenType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import axiosRequest from 'api/axiosRequest';

const Detail = observer(() => {
  const [locationData, setLocationData] = useState<LocationDataType | null>(null);
  const location = useLocation();
  const { ScreenSizeStore, CustomDialogStore, LocationStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const setAccidentLists = useCallback(() => {
    if (locationData && locationData?.accidents?.length > 0) {
      CustomDialogStore.openAccidentDialog(locationData.accidents);
    }
  }, [CustomDialogStore, locationData]);

  const initLocationData = useCallback(async () => {
    if (location.search.length === 0) return;
    const placeName: string = decodeURI(location.search).replace('?name=', '');
    LocationStore.setPlaceName(placeName);
    const requestType: string = locationRequestTypes.skt.includes(
      locationNames[placeName] || placeName
    )
      ? 'skt-place'
      : 'kt-place';
    const pathnameArr: string[] = location.pathname.split('/');
    const response: { data: LocationDataType } | undefined = await axiosRequest(
      `${requestType}/${pathnameArr[pathnameArr.length - 1]}`
    );
    if (!response) return;
    setLocationData(response.data);
  }, [LocationStore, location.pathname, location.search]);

  useEffect(() => {
    if (location.search.length === 0) return;
    const placeName: string = decodeURI(location.search).replace('?name=', '');
    const htmlTitle = document.querySelector('title');
    if (!htmlTitle) return;
    htmlTitle.innerHTML = `${locationNames[placeName] || placeName} : 와글와글 장소`;
  }, [location.search]);

  useEffect(() => {
    initLocationData();
  }, [initLocationData, LocationStore.placeName]);

  useEffect(() => {
    setAccidentLists();
  }, [locationData, setAccidentLists]);

  return (
    <Wrap
      screenType={ScreenSizeStore.screenType}
      screenWidth={ScreenSizeStore.screenWidth}
      isDarkTheme={isDarkTheme}
    >
      <DetailHeader locationData={locationData} />
      <DetailedCongestion locationData={locationData} initLocationData={initLocationData} />
      <LocationInformation locationData={locationData} />
      <RelatedLocations />
      <MarginArea isDarkTheme={isDarkTheme} />
    </Wrap>
  );
});

export default Detail;

const Wrap = styled('div')<{ screenType: ScreenType; screenWidth: number; isDarkTheme: boolean }>(
  ({ screenType, screenWidth, isDarkTheme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: screenType === 'mobile' ? screenWidth : 640,
    color: isDarkTheme ? palette.white : palette.black,
  })
);

const MarginArea = styled('div')<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  height: '64px',
  backgroundColor: isDarkTheme ? palette.black : palette.white,
}));
