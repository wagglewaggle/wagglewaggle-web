import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import { Footer } from 'components/common';
import { useStore } from 'stores';
import { palette } from 'constants/';
import lottie from 'lottie-web';
import logo from 'assets/icons/logo-icon.svg';
import searchIcon from 'assets/icons/search-icon.svg';
import refreshIcon from 'assets/icons/refresh-icon.svg';
import rightIcon from 'assets/icons/right-icon.svg';

const Error = observer(() => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { ErrorStore, ThemeStore, CustomDrawerStore } = useStore().MobxStore;
  const location = useLocation();
  const navigate = useNavigate();

  const handleRefresh = () => {
    ErrorStore.setStatusCode(null);
    navigate(-1);
  };

  const handleMoveHome = () => {
    ErrorStore.setStatusCode(null);
    navigate(`/${CustomDrawerStore.variant}`);
  };

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/${ThemeStore.theme}/Error.json`),
    });
  }, [ThemeStore.theme]);

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
    <Wrap>
      <Search>
        <img src={logo} alt='logo' onClick={handleMoveHome} />
        <SearchBox />
        <img src={searchIcon} alt='search' />
      </Search>
      <ErrorWrap>
        <Lottie ref={lottieContainer}></Lottie>
        <Title>{errorMessage}</Title>
        <ErrorCode>{`에러 코드:${ErrorStore.statusCode}`}</ErrorCode>
      </ErrorWrap>
      <Buttons>
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
      </Buttons>
      <Footer />
    </Wrap>
  );
});

export default Error;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 72,
  width: '100%',
  minHeight: 'calc(100vh - 72px)',
  '& img': {
    filter: 'invert(1)',
  },
});

const Search = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: 56,
  '& img': {
    width: 32,
    height: 32,
  },
  '& img:first-of-type': {
    cursor: 'pointer',
  },
});

const SearchBox = styled('div')({
  flexGrow: 1,
  height: '100%',
});

const ErrorWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Lottie = styled('div')({
  margin: '40px 0 24px',
  width: 120,
  height: 120,
  overflow: 'hidden',
});

const Title = styled('div')({
  fontSize: 18,
  fontWeight: 600,
});

const ErrorCode = styled('span')({
  margin: '8px 0 64px',
  color: palette.grey[400],
  fontSize: 14,
  fontWeight: 400,
});

const Buttons = styled('div')({
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
});
