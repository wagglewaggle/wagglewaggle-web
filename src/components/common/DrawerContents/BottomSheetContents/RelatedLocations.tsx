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
          {relatedPlaces.map((place: PlaceDataType) => (
            <PlaceWrap key={`related-locations-${place.name}`} className='related-locations-wrap'>
              <PlaceCard fromBottomSheet place={place} />
            </PlaceWrap>
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
  padding: '40px 24px 32px',
  width: 'calc(100% - 48px)',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  '& .related-locations-wrap:last-of-type': {
    marginBottom: 96,
  },
}));

const Header = styled('div')({
  marginBottom: 24,
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
});

const PlaceWrap = styled('div')({
  width: '100%',
});
