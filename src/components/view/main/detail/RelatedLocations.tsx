import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';
import { palette, districts } from 'constants/';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    marginTop: 8,
    backgroundColor: palette.grey[700],
  },
  header: {
    marginBottom: 24,
    width: '100%',
    fontSize: 18,
    fontWeight: 600,
  },
}));

const RelatedLocations = observer(() => {
  const [places, setPlaces] = useState<placeDataType[]>([]);
  const classes = useStyles();
  const { LocationStore } = useStore().MobxStore;

  const initRelatedLocations = useCallback(async () => {
    if (!LocationStore.placeName || !districts[LocationStore.placeName]) return;
    type responseType = { data: { ktPlaces: placeDataType[]; sktPlaces: placeDataType[] } };
    const response: responseType | undefined = await axiosRequest(
      `location/${districts[LocationStore.placeName]}`
    );
    if (!response) return;
    setPlaces([...response.data.ktPlaces, ...response.data.sktPlaces]);
  }, [LocationStore.placeName]);

  useEffect(() => {
    initRelatedLocations();
  }, [LocationStore.placeName, initRelatedLocations]);

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>관련 장소 현황</div>
      {places.map((place: placeDataType, idx: number) => (
        <PlaceCard key={`related-locations-${idx}`} place={place} />
      ))}
    </div>
  );
});

export default RelatedLocations;
