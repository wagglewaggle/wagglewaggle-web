import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DetailHeader from './DetailHeader';
import DetailedCongestion from './DetailedCongestion';
import LocationInformation from './LocationInformation';
import RelatedLocations from './RelatedLocations';
import { useStore } from 'stores';
import { locationDataType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import axiosRequest from 'api/axiosRequest';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    color: palette.white,
  },
  veryUncrowded: {
    color: palette.blue,
  },
  uncrowded: {
    color: palette.green,
  },
  normal: {
    color: palette.yellow,
  },
  crowded: {
    color: palette.orange,
  },
  veryCrowded: {
    color: palette.red,
  },
}));

const Detail = observer(() => {
  const [locationData, setLocationData] = useState<locationDataType | null>(null);
  const classes = useStyles();
  const location = useLocation();
  const { ScreenSizeStore, CustomDialogStore, LocationStore } = useStore().MobxStore;
  const BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth : 640,
  };

  const setAccidentLists = useCallback(() => {
    if (locationData && locationData?.accidents?.length > 0) {
      CustomDialogStore.openAccidentDialog(locationData.accidents);
    }
  }, [CustomDialogStore, locationData]);

  const initLocationData = useCallback(async () => {
    if (location.search.length === 0) return;
    const placeName: string = LocationStore.placeName as string;
    const requestType: string = locationRequestTypes.skt.includes(
      locationNames[placeName] || placeName
    )
      ? 'skt-place'
      : 'kt-place';
    const response: { data: locationDataType } | undefined = await axiosRequest(
      `${requestType}/${location.search.replace('?place-id=', '')}`
    );
    if (!response) return;
    setLocationData(response.data);
  }, [LocationStore.placeName, location.search]);

  useEffect(() => {
    initLocationData();
  }, [initLocationData, LocationStore.placeName]);

  useEffect(() => {
    setAccidentLists();
  }, [locationData, setAccidentLists]);

  return (
    <Box className={classes.wrap} sx={BOX_STYLE}>
      <DetailHeader locationData={locationData} />
      <DetailedCongestion locationData={locationData} initLocationData={initLocationData} />
      <LocationInformation locationData={locationData} />
      <RelatedLocations />
    </Box>
  );
});

export default Detail;
