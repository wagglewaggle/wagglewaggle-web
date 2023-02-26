import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceStatus } from 'components/common';
import { symbols, locationNames } from 'constants/';
import { CategoryType, PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import { palette } from 'constants/';

interface propsType {
  place: PlaceDataType;
}

const PlaceCard = observer((props: propsType) => {
  const { place } = props;
  const [categories, setCategories] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const { LocationStore, ThemeStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const primaryCategories: string[] = useMemo(() => ['한강', '공원', '궁궐'], []);
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handlePlaceCardClick = () => {
    LocationStore.setPlaceName(place.name);
    navigate(`/main/detail/${place.idx}?name=${place.name}`);
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
        <PlaceStatus status={place.populations[0].level} />
      </StatusWrap>
    </Wrap>
  );
});

export default PlaceCard;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: 4,
  padding: '14px 16px',
  marginBottom: 8,
  width: 'calc(100% - 32px)',
  height: 'fit-content',
  backgroundColor: palette.grey[isDarkTheme ? 600 : 100],
  cursor: 'pointer',
}));

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
