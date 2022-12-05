import { useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import homeImage from 'assets/symbols/white-roof-house.svg';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/palette';

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
  },
  placeName: {
    color: palette.white,
    fontSize: 18,
    fontWeight: 500,
  },
  placeCategory: {
    fontSize: 12,
    fontWeight: 500,
    color: palette.grey[400],
  },
  placeStatus: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 500,
  },
  veryUncrowded: {
    color: palette.blue,
  },
  uncrowded: {
    color: palette.green,
  },
  normal: {
    color: palette.yellow,
  },
  crowded: {
    color: palette.orange,
  },
  veryCrowded: {
    color: palette.red,
  },
}));

interface propsType {
  place: placeDataType;
}

const PlaceCard = (props: propsType) => {
  const { place } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const statusElement: JSX.Element =
    place.status === 'very uncrowded' ? (
      <span className={classes.veryUncrowded}>매우 여유</span>
    ) : place.status === 'uncrowded' ? (
      <span className={classes.uncrowded}>여유</span>
    ) : place.status === 'normal' ? (
      <span className={classes.normal}>보통</span>
    ) : place.status === 'crowded' ? (
      <span className={classes.crowded}>붐빔</span>
    ) : (
      <span className={classes.veryCrowded}>매우 붐빔</span>
    );

  const handlePlaceCardClick = () => {
    navigate(`/detail/${place.id}`);
  };

  return (
    <div className={classes.placeCard} onClick={handlePlaceCardClick}>
      <div className={classes.placeLeft}>
        <div className={classes.placeImage}>
          <img src={homeImage} alt='home' />
        </div>
        <div className={classes.placeTitle}>
          <span className={classes.placeName}>{place.name}</span>
          <span className={classes.placeCategory}>{place.category}</span>
        </div>
      </div>
      <div className={classes.placeStatus}>{statusElement}</div>
    </div>
  );
};

export default PlaceCard;
