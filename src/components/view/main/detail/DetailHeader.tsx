import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import backgroundImage from 'assets/dummy-result-image.png';
import leftIcon from 'assets/icons/left-icon.svg';
import { locationDataType } from 'types/typeBundle';
import { palette, locationNames } from 'constants/';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px',
    height: 448,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    // 아래 background-color는 임시 이미지 용으로 추후 삭제 필요
    backgroundColor: '#112258',
  },
  buttonArea: {
    padding: '12px 0',
    '& button': {
      padding: 0,
      width: 32,
      height: 32,
      justifyContent: 'flex-start',
    },
  },
  categoryName: {
    margin: '8px 0',
    color: palette.grey[400],
    fontSize: 12,
    fontWeight: 500,
  },
  statusWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    whiteSpace: 'pre-line',
    lineHeight: '32px',
  },
  status: {
    fontSize: 24,
    fontWeight: 600,
  },
}));

interface propsType {
  locationData: locationDataType | null;
}

const DetailHeader = (props: propsType) => {
  const { locationData } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.buttonArea}>
        <IconButton onClick={handleBackClick}>
          <img src={leftIcon} alt='left' />
        </IconButton>
      </div>
      <div className={classes.categoryName}>{locationData?.category}</div>
      <div className={classes.statusWrap}>
        <div className={classes.status}>
          {`지금 ${locationNames[locationData?.name || ''] || locationData?.name}에
          사람이 `}
          <PlaceStatus
            status={locationData?.level || undefined}
            comments={{
              VERY_RELAXATION: '거의 없어요.',
              RELAXATION: '조금 있어요.',
              NORMAL: '적당해요.',
              CROWDED: '많아요.',
              VERY_CROWDED: '너무 많아요.',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
