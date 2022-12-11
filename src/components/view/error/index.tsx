import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/palette';
import errorImage from 'assets/error-image.png';
import logo from 'assets/temp-logo.png';
import searchIcon from 'assets/icons/search-icon.svg';
import refreshIcon from 'assets/icons/refresh-icon.svg';
import rightIcon from 'assets/icons/right-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    color: palette.white,
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 56,
  },
  searchBox: {
    flexGrow: 1,
    height: '100%',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorImage: {
    margin: '40px 0 24px',
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  errorCode: {
    margin: '8px 0 64px',
    color: palette.grey[400],
    fontSize: 14,
    fontWeight: 400,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    gap: 24,
    '& div': {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      cursor: 'pointer',
    },
    '& button': {
      padding: 0,
      height: 19,
    },
    '& img': {
      width: 16,
      height: 16,
    },
  },
}));

const NotFound = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate(`${location.pathname}${location.search}`);
  };

  const handleMoveHome = () => {
    navigate('/main');
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.search}>
        <img src={logo} alt='logo' />
        <div className={classes.searchBox} />
        <img src={searchIcon} alt='search' />
      </div>
      <div className={classes.error}>
        <img className={classes.errorImage} src={errorImage} alt='not-found' />
        <div className={classes.title}>페이지를 찾을 수 없어요.</div>
        <span className={classes.errorCode}>에러 코드:404</span>
      </div>
      <div className={classes.buttons}>
        <div onClick={handleRefresh}>
          새로 고침
          <IconButton>
            <img src={refreshIcon} alt='refresh' />
          </IconButton>
        </div>
        <div onClick={handleMoveHome}>
          홈으로 이동
          <IconButton>
            <img src={rightIcon} alt='right' />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
