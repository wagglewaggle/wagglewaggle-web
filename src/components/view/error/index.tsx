import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useStore } from 'stores';
import { palette } from 'constants/';
import lottie from 'lottie-web';
import ErrorLottie from 'assets/lottie/Error.json';
import logo from 'assets/icons/logo-icon.svg';
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
    '& img': {
      width: 32,
      height: 32,
    },
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
  lottie: {
    margin: '40px 0 24px',
    width: 120,
    height: 120,
    overflow: 'hidden',
  },
}));

const Error = observer(() => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const lottieContainer = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const { ErrorStore } = useStore().MobxStore;
  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    ErrorStore.setStatusCode(null);
    navigate(`${location.pathname}${location.search}`);
  };

  const handleMoveHome = () => {
    ErrorStore.setStatusCode(null);
    navigate('/main');
  };

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: ErrorLottie,
    });
  }, [lottieContainer.current]);

  useEffect(() => {
    setErrorMessage(
      ErrorStore.statusCode === 404 ? '페이지를 찾을 수 없어요.' : '잠시 뒤에 새로 고침해주세요.'
    );
  }, [ErrorStore.statusCode]);

  useEffect(() => {
    const pathname: string = location.pathname;
    if (pathname === '/error') return;
    ErrorStore.setStatusCode(pathname === '/not-found' ? 404 : null);
  }, [ErrorStore, location.pathname]);

  return (
    <div className={classes.wrap}>
      <div className={classes.search}>
        <img src={logo} alt='logo' />
        <div className={classes.searchBox} />
        <img src={searchIcon} alt='search' />
      </div>
      <div className={classes.error}>
        <div className={classes.lottie} ref={lottieContainer}></div>
        <div className={classes.title}>{errorMessage}</div>
        <span className={classes.errorCode}>{`에러 코드:${ErrorStore.statusCode}`}</span>
      </div>
      <div className={classes.buttons}>
        {ErrorStore.statusCode !== 404 && (
          <div onClick={handleRefresh}>
            새로 고침
            <IconButton>
              <img src={refreshIcon} alt='refresh' />
            </IconButton>
          </div>
        )}
        <div onClick={handleMoveHome}>
          홈으로 이동
          <IconButton>
            <img src={rightIcon} alt='right' />
          </IconButton>
        </div>
      </div>
    </div>
  );
});

export default Error;
