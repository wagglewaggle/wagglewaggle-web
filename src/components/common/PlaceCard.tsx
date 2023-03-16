import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceStatus } from 'components/common';
import { symbols, locationNames } from 'constants/';
import { CategoryType, FavoritePlaceType, PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import { ReactComponent as CctvIcon } from 'assets/icons/drawer/cctv.svg';

interface propsType {
  place: PlaceDataType;
  fromBottomSheet?: boolean;
}

const PlaceCard = observer((props: propsType) => {
  const { place, fromBottomSheet } = props;
  const [categories, setCategories] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const { LocationStore, ThemeStore, CustomDrawerStore, AuthStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const primaryCategories: string[] = useMemo(() => ['한강', '공원', '궁궐'], []);
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const isPinned = place.type
    ? AuthStore.favorites.places
        .map((favorite: FavoritePlaceType) => favorite.place.name)
        .includes(place.name)
    : false;

  const handlePlaceCardClick = () => {
    if (!fromBottomSheet) {
      CustomDrawerStore.setDrawerStatus({ expanded: 'appeared' });
    }
    LocationStore.setPlaceName(place.name);
    navigate(`/map/detail/${place.idx}?name=${place.name}`);
  };

  useEffect(() => {
    if (!place.categories) return;
    const categoryList: string[] = place.categories.map((category: CategoryType) => category.type);
    setCategories(categoryList.join(', '));
    const addedSymbol: string[] = [];
    primaryCategories.forEach((category: string) => {
      if (addedSymbol.length > 0) return;
      if (categoryList.includes(category)) {
        addedSymbol.push(category);
        setSymbol(category);
      }
    });
    categoryList.forEach((category: string) => {
      if (addedSymbol.length > 0) return;
      addedSymbol.push(category);
      setSymbol(category);
    });
  }, [primaryCategories, place.categories]);

  return (
    <Wrap isDarkTheme={isDarkTheme} onClick={handlePlaceCardClick}>
      <PlaceWrap>
        <PlaceLeft>
          <PlaceImage>
            <img src={symbols[symbol]} alt='category-symbol' />
          </PlaceImage>
          <PlaceTitle>
            <PlaceName>{locationNames[place?.name || ''] || place?.name}</PlaceName>
            <PlaceCategory>{categories}</PlaceCategory>
          </PlaceTitle>
        </PlaceLeft>
        <StatusWrap>
          <PlaceStatus status={place.population.level} />
        </StatusWrap>
      </PlaceWrap>
      <IconsInfoWrap>
        <IconsWrap isPinned={isPinned}>
          <HeartIcon /> {String(place.pinPlaceCount).padStart(2, '0')}
        </IconsWrap>
        <IconsWrap>
          <ChatIcon /> {String(place.reviewPostCount).padStart(2, '0')}
        </IconsWrap>
        {place.cctvCount ? (
          <IconsWrap>
            <CctvIcon /> {String(place.cctvCount).padStart(2, '0')}
          </IconsWrap>
        ) : (
          <></>
        )}
      </IconsInfoWrap>
    </Wrap>
  );
});

export default PlaceCard;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 4,
  padding: '14px 16px',
  marginBottom: 8,
  width: 'calc(100% - 32px)',
  height: 'fit-content',
  backgroundColor: palette.grey[isDarkTheme ? 600 : 100],
  cursor: 'pointer',
  gap: 12,
}));

const PlaceWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

const PlaceLeft = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
});

const PlaceImage = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    width: 40,
    height: 40,
  },
});

const PlaceTitle = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: 8,
  lineHeight: '20px',
});

const PlaceName = styled('span')({
  fontSize: 14,
  fontWeight: 600,
});

const PlaceCategory = styled('span')({
  fontSize: 14,
  fontWeight: 400,
});

const StatusWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  fontWeight: 600,
});

const IconsInfoWrap = styled('div')({
  display: 'flex',
  gap: 12,
});

const IconsWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isPinned',
})<{ isPinned?: boolean }>(({ isPinned }) => ({
  display: 'flex',
  color: palette.grey[400],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));
