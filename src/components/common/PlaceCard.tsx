import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import { symbols, locationNames } from 'constants/';
import { categoryType, placeDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import { palette } from 'constants/';

const useStyles = makeStyles(() => ({
  placeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 4,
    padding: '14px 16px',
    marginBottom: 8,
    width: 'calc(100% - 32px)',
    height: 'fit-content',
    backgroundColor: palette.grey[600],
    cursor: 'pointer',
  },
  placeLeft: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
  placeImage: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 40,
      height: 40,
    },
  },
  placeTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 8,
    lineHeight: '20px',
  },
  placeName: {
    color: palette.white,
    fontSize: 14,
    fontWeight: 600,
  },
  placeCategory: {
    fontSize: 14,
    fontWeight: 400,
    color: palette.grey[400],
  },
  statusWrap: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
  },
}));

interface propsType {
  place: placeDataType;
}

const PlaceCard = (props: propsType) => {
  const { place } = props;
  const [categories, setCategories] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const classes = useStyles();
  const { LocationStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const primaryCategories: string[] = useMemo(() => ['한강', '공원', '궁궐'], []);

  const handlePlaceCardClick = () => {
    LocationStore.setPlaceName(place.name);
    // LocationStore.setCategories(place.categories.map((category: categoryType) => category.type));
    navigate(`/main/detail?place-id=${place.idx}`);
  };

  useEffect(() => {
    if (!place.categories) return;
    const categoryList: string[] = place.categories.map((category: categoryType) => category.type);
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
      if (category !== '크리스마스 핫플') {
        addedSymbol.push(category);
        setSymbol(category);
      }
    });
  }, [primaryCategories, place.categories]);

  return (
    <div className={classes.placeCard} onClick={handlePlaceCardClick}>
      <div className={classes.placeLeft}>
        <div className={classes.placeImage}>
          <img src={symbols[symbol]} alt='category-symbol' />
        </div>
        <div className={classes.placeTitle}>
          <span className={classes.placeName}>
            {locationNames[place?.name || ''] || place?.name}
          </span>
          <span className={classes.placeCategory}>{categories}</span>
        </div>
      </div>
      <div className={classes.statusWrap}>
        <PlaceStatus status={place.populations[0].level} />
      </div>
    </div>
  );
};

export default PlaceCard;
