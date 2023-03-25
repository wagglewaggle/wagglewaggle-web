import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import EmptyLists from './EmptyLists';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import { FavoritePlaceType } from 'types/typeBundle';

type PropsType = {
  favPlaces: FavoritePlaceType[];
};

const FavoritePlaces = (props: PropsType) => {
  const { favPlaces } = props;
  const { LocationStore } = useStore().MobxStore;

  return (
    <Wrap>
      {favPlaces.length === 0 ? (
        <EmptyLists
          title='관심 설정한 장소가 없어요.'
          content='지금 바로 관심있는 장소에 좋아요를 눌러보세요!'
        />
      ) : (
        <>
          {favPlaces.map((place: FavoritePlaceType) => (
            <PlaceCard
              key={`fav-place-${place.place.name}`}
              place={{ ...place.place, categories: LocationStore.categories[place.place.name] }}
            />
          ))}
        </>
      )}
    </Wrap>
  );
};

export default observer(FavoritePlaces);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 24px',
  width: 'calc(100% - 48px)',
});
