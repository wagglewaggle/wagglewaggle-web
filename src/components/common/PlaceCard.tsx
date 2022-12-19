import { useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import { symbols } from 'constants/';
import { placeDataType } from 'types/typeBundle';
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
  const classes = useStyles();
  const navigate = useNavigate();

  const handlePlaceCardClick = () => {
    navigate(`/main/detail?place-id=${place.id}`);
  };

  return (
    <div className={classes.placeCard} onClick={handlePlaceCardClick}>
      <div className={classes.placeLeft}>
        <div className={classes.placeImage}>
          <img src={symbols[place.category.split(',')[0]]} alt='category-symbol' />
        </div>
        <div className={classes.placeTitle}>
          <span className={classes.placeName}>{place.name}</span>
          <span className={classes.placeCategory}>{place.category}</span>
        </div>
      </div>
      <div className={classes.statusWrap}>
        <PlaceStatus status={place.status} />
      </div>
    </div>
  );
};

export default PlaceCard;
