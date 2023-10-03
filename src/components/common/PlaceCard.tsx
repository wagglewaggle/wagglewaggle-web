import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { PC } from './styled';
import { PlaceStatus } from 'components/common';
import { symbols, locationNames } from 'constants/';
import { CategoryType, PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';

interface propsType {
  place: PlaceDataType;
}

const PlaceCard = observer((props: propsType) => {
  const { place } = props;
  const [categories, setCategories] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const { LocationStore, ThemeStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const primaryCategories: string[] = useMemo(() => ['강변', '공원', '궁궐'], []);
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handlePlaceCardClick = () => {
    LocationStore.setPlaceName(place.name);
    navigate(`/detail/${place.idx}?name=${place.name}`);
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
    <PC.Wrap isDarkTheme={isDarkTheme} onClick={handlePlaceCardClick}>
      <PC.PlaceLeft>
        <PC.PlaceImage>
          <img src={symbols[symbol]} alt='category-symbol' />
        </PC.PlaceImage>
        <PC.PlaceTitle>
          <PC.PlaceName>{locationNames[place?.name || ''] || place?.name}</PC.PlaceName>
          <PC.PlaceCategory>{categories}</PC.PlaceCategory>
        </PC.PlaceTitle>
      </PC.PlaceLeft>
      <PC.StatusWrap>
        <PlaceStatus status={place.population?.level} />
        <PC.RightArrow />
      </PC.StatusWrap>
    </PC.Wrap>
  );
});

export default PlaceCard;
