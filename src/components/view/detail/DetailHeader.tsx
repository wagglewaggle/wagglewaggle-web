import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, ClassNameMap } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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
  dateWrap: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 400,
    '& button': {
      marginRight: 5,
    },
    '& svg': {},
  },
}));

interface propsType {
  status: statusType;
  rootClasses: ClassNameMap<'veryUncrowded' | 'uncrowded' | 'normal' | 'crowded' | 'veryCrowded'>;
}

const DetailHeader = (props: propsType) => {
  const { status, rootClasses } = props;
  const [descriptionElement, setDescriptionElement] = useState<JSX.Element>(<Fragment />);
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/main');
  };

  useEffect(() => {
    if (status === 'very uncrowded') {
      setDescriptionElement(<span className={rootClasses.veryUncrowded}>거의 없어요.</span>);
    } else if (status === 'uncrowded') {
      setDescriptionElement(<span className={rootClasses.uncrowded}>조금 있어요.</span>);
    } else if (status === 'normal') {
      setDescriptionElement(<span className={rootClasses.normal}>적당해요.</span>);
    } else if (status === 'crowded') {
      setDescriptionElement(<span className={rootClasses.crowded}>많아요.</span>);
    } else if (status === 'very crowded') {
      setDescriptionElement(<span className={rootClasses.veryCrowded}>너무 많아요.</span>);
    }
  }, [status, rootClasses]);

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
          {descriptionElement}
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
