import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import backgroundImage from 'assets/dummy-result-image.png';
import leftIcon from 'assets/icons/left-icon.svg';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px',
    height: 448,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
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
    marginBottom: 8,
    color: palette.grey[400],
    fontSize: 12,
    fontWeight: 500,
  },
  statusWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    whiteSpace: 'pre-line',
  },
  status: {
    fontSize: 24,
    fontWeight: 700,
  },
}));

interface propsType {
  status: statusType;
}

const DetailHeader = (props: propsType) => {
  const { status } = props;
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
      <div className={classes.categoryName}>카테고리명</div>
      <div className={classes.statusWrap}>
        <div className={classes.status}>
          {`지금 명동 남산타워에
          사람이 `}
          <PlaceStatus
            status={status}
            comments={{
              'very uncrowded': '거의 없어요.',
              uncrowded: '조금 있어요.',
              normal: '적당해요.',
              crowded: '많아요.',
              'very crowded': '너무 많아요.',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
