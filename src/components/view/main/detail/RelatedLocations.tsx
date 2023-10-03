import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceCard } from 'components/common';
import { PlaceDataType } from 'types/typeBundle';
import { palette, locationNames, districts } from 'constants/';
import { useStore } from 'stores';
import { request } from 'api/request';

const RelatedLocations = observer(() => {
  const [places, setPlaces] = useState<PlaceDataType[]>([]);
  const { LocationStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const initRelatedLocations = useCallback(async () => {
    if (
      !LocationStore.placeName ||
      !districts[locationNames[LocationStore.placeName] || LocationStore.placeName]
    )
      return;
    type responseType = { data: { ktPlaces: PlaceDataType[]; sktPlaces: PlaceDataType[] } };
    const response: responseType | undefined = await request.getLocationData(
      districts[locationNames[LocationStore.placeName] || LocationStore.placeName]
    );
    if (!response) return;
    setPlaces(
      [...response.data.ktPlaces, ...response.data.sktPlaces].filter(
        (place: PlaceDataType) => place.name !== LocationStore.placeName
      )
    );
  }, [LocationStore.placeName]);

  useEffect(() => {
    initRelatedLocations();
  }, [LocationStore.placeName, initRelatedLocations]);

  return (
    <>
      {places.length > 0 && (
        <Wrap isDarkTheme={isDarkTheme}>
          <Header>주변 장소 현황</Header>
          {places.map((place: PlaceDataType) => (
            <PlaceCard key={place.name} place={place} />
          ))}
        </Wrap>
      )}
    </>
  );
});

export default RelatedLocations;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px 24px 0 24px',
  marginTop: 8,
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
}));

const Header = styled('div')({
  marginBottom: 24,
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
});
