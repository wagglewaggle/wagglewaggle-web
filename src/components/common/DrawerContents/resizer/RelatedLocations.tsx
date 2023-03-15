import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceCard } from 'components/common';
import { PlaceDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import { useStore } from 'stores';

interface PropsType {
  places: string[];
}

const RelatedLocations = observer((props: PropsType) => {
  const { places } = props;
  const { LocationStore, ThemeStore } = useStore().MobxStore;
  const { placesData } = LocationStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const relatedPlaces = placesData.filter((place: PlaceDataType) => places.includes(place.name));

  return (
    <>
      {relatedPlaces.length === 0 ? (
        <></>
      ) : (
        <Wrap isDarkTheme={isDarkTheme}>
          <Header>주변 장소 현황</Header>
          {relatedPlaces.map((place: PlaceDataType, idx: number) => (
            <PlaceCard key={`related-locations-${idx}`} isResizer place={place} />
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
  padding: '20px 24px 16px',
  width: 'calc(100% - 48px)',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
}));

const Header = styled('div')({
  marginBottom: 24,
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
});
