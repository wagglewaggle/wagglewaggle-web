import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import EmptyLists from '../common/EmptyLists';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import { FavoritePlaceType } from 'types/typeBundle';

const FavoritePlaces = () => {
  const { ProfileStore, LocationStore } = useStore().MobxStore;
  const { favPlaces } = ProfileStore;

  return (
    <Wrap>
      {favPlaces.data.length === 0 ? (
        <EmptyLists title='작성한 게시물이 없어요' content='궁금한 장소에 게시물을 작성해보세요.' />
      ) : (
        <CardsWrap>
          {favPlaces.data.map((place: FavoritePlaceType) => (
            <PlaceCard
              key={`fav-place-${place.place.name}`}
              place={{ ...place.place, categories: LocationStore.categories[place.place.name] }}
            />
          ))}
        </CardsWrap>
      )}
    </Wrap>
  );
};

export default observer(FavoritePlaces);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 24px',
  width: 'calc(100% - 48px)',
});

const CardsWrap = styled('div')({
  padding: '16px 0',
  width: '100%',
});
