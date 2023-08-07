import { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isIOS, isMobile } from 'react-device-detect';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import useResizeObserver from 'use-resize-observer';
import { Box, Link, styled } from '@mui/material';
import { CustomDialog, CustomDrawer, CustomSpinner, ReviewWriteButton } from 'components/common';
import PrivateRoutes from './PrivateRoutes';
import DeepLinkRoutes from 'DeepLinkRoutes';
import { Login, Profile, BrowserPage } from './components/view';
import ReplyPage from 'components/view/review/ReplyPage';
import ReviewDetail from 'components/view/review/ReviewDetail';
import ReviewWritePage from 'components/view/review/ReviewWritePage';
import { CreateStore, RootStore } from 'stores';
import { ScreenType } from 'types/typeBundle';
import axiosRequest from 'api/axiosRequest';
import { palette } from 'constants/';

export const MobxStore = new RootStore();

const App = observer(() => {
  const {
    AuthStore,
    ScreenSizeStore,
    ThemeStore,
    UserNavigatorStore,
    CustomDialogStore,
    CustomDrawerStore,
  } = MobxStore;
  const { ref, width, height } = useResizeObserver();
  const history = createBrowserHistory();
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isWebView = !!(window as unknown as { ReactNativeWebView: unknown }).ReactNativeWebView;

  const disableIosInputAutoZoom = () => {
    const metaEl = document.querySelector('meta[name=viewport]');
    if (!metaEl) return;
    const newContentArr: string[] = (metaEl as unknown as { content: string }).content.split(', ');
    const maximumScaleContent: string = 'maximum-scale=1';
    if (newContentArr.includes(maximumScaleContent)) return;
    newContentArr.push(maximumScaleContent);
    metaEl.setAttribute('content', newContentArr.join(', '));
  };

  const reactNativeListener = (e: Event) => {
    const { data } = e as MessageEvent;
    if (typeof data !== 'string') return;
    if (!data.startsWith('wagglewaggle') && !data.startsWith('exp')) return;
    UserNavigatorStore.setDeepLinkUrl(data);
    document.removeEventListener('message', reactNativeListener, true); // android
    window.removeEventListener('message', reactNativeListener, true); // ios

    // 유저 위치 관련 기능은 해당 기능 활성화될 때 재구현 예정
    // if (UserNavigatorStore.loaded || typeof data !== 'string') return;
    // try {
    //   const { code, latitude, longitude } = JSON.parse(data);
    //   if (code !== 'success' || !latitude || !longitude) return;
    //   UserNavigatorStore.setUserLocation([latitude, longitude], false);
    //   UserNavigatorStore.setLoaded(true);
    // } catch {
    //   UserNavigatorStore.setUserLocation([37.625638, 127.038941], false);
    // }
  };

  // 유저 위치 관련 기능은 해당 기능 활성화될 때 재구현 예정
  // const onGeolocationSuccess = ({
  //   coords,
  // }: {
  //   coords: { latitude: number; longitude: number };
  // }) => {
  //   const { latitude, longitude } = coords;
  //   UserNavigatorStore.setUserLocation([latitude, longitude], false);
  //   UserNavigatorStore.setLoaded(true);
  // };

  useEffect(() => {
    if (!isIOS) return;
    disableIosInputAutoZoom();
  }, []);

  useEffect(() => {
    const accessTokenKey = '@wagglewaggle_access_token';
    if (sessionStorage.getItem(accessTokenKey)) {
      AuthStore.setAuthorized(true);
    }
  }, [AuthStore]);

  useEffect(() => {
    history.listen(() => {
      if (history.action !== 'POP') return;
      if (!CustomDialogStore.open) return;
      CustomDialogStore.setOpen(false);
    });
  }, [history, CustomDialogStore, CustomDialogStore.open]);

  useEffect(() => {
    if (!width || !height) return;
    const screenType: ScreenType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'pc';
    ScreenSizeStore.setScreenType(screenType);
    ScreenSizeStore.setScreenSize(width, height);
  }, [ScreenSizeStore, width, height]);

  useEffect(() => {
    if (isWebView) {
      document.addEventListener('message', reactNativeListener, true); // android
      window.addEventListener('message', reactNativeListener, true); // ios
    }
    // 유저 위치 관련 기능은 해당 기능 활성화될 때 재구현 예정
    // if (!navigator.geolocation) return;
    // navigator.geolocation.getCurrentPosition(onGeolocationSuccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reissueToken = useCallback(
    async (refreshToken: string) => {
      if (sessionStorage.getItem('@wagglewaggle_authorized')) {
        AuthStore.setAuthorized(true);
        return;
      }
      AuthStore.setIsLoggingIn(true);
      const response = await axiosRequest('post', 'auth/reissue', { refreshToken });
      AuthStore.setIsLoggingIn(false);
      if (response?.data?.accessToken) {
        AuthStore.setAuthorized(true);
        return;
      }
      CustomDialogStore.setOpen(false);
      CustomDrawerStore.closeDrawer();
    },
    [AuthStore, CustomDialogStore, CustomDrawerStore]
  );

  const closeCustomDialog = useCallback(() => {
    CustomDialogStore.setOpen(false);
  }, [CustomDialogStore]);

  useEffect(() => {
    if (AuthStore.authorized || AuthStore.isLoggingIn) return;
    const refreshToken = localStorage.getItem('@wagglewaggle_refresh_token');
    if (refreshToken) {
      reissueToken(refreshToken);
      return;
    }
  }, [AuthStore, AuthStore.authorized, reissueToken]);

  useEffect(() => {
    const handleLinkClick = () => {
      window.open('https://wagglewaggle.co.kr', '_blank');
    };

    CustomDialogStore.openNotificationDialog({
      title: '앱 서비스 운영 정지 안내',
      content: (
        <>
          {'안녕하세요, 와글와글입니다🐰\n'}
          <Box sx={{ fontWeight: 700 }}>
            {'와글와글 앱 서비스를 8월 13일 이후\n다시 웹 서비스로 전환하고자 합니다.\n'}
          </Box>
          {'그동안 와글와글 앱을 이용해주셔서 감사합니다.\n웹사이트에서 다시만나요!'}
        </>
      ),
      subContent: (
        <Box sx={{ marginTop: '20px' }}>
          웹사이트 링크 : <Link onClick={handleLinkClick}>https://wagglewaggle.co.kr</Link>
        </Box>
      ),
      rightButton: { title: '확인', handleClick: closeCustomDialog },
    });
  }, [CustomDialogStore, closeCustomDialog]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CreateStore.Provider value={{ MobxStore }}>
        <ServiceWrap ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/landing' element={<BrowserPage />} />
              <Route
                path='/login/*'
                element={isWebView ? <Login /> : <Navigate replace to='/landing' />}
              />
              <Route
                path='/*'
                element={
                  isWebView ? (
                    <PrivateRoutes />
                  ) : window.location.pathname !== '/' && isMobile ? (
                    <DeepLinkRoutes />
                  ) : (
                    <Navigate replace to='/landing' />
                  )
                }
              />
            </Routes>
            <CustomDrawer />
            <ReviewWriteButton />
            <Profile />
            <ReviewDetail />
            <ReplyPage />
            <ReviewWritePage />
          </BrowserRouter>
        </ServiceWrap>
        <CustomDialog />
        <CustomSpinner />
      </CreateStore.Provider>
    </Wrap>
  );
});

export default App;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'center',
  minWidth: 360,
  color: isDarkTheme ? palette.white : palette.black,
  backgroundColor: isDarkTheme ? palette.grey[800] : palette.white,
  overflowX: 'hidden',
}));

const ServiceWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: 'fit-content',
  minHeight: '100vh',
});
