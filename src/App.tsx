import { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { observer } from 'mobx-react';
import useResizeObserver from 'use-resize-observer';
import { styled } from '@mui/material';
import { CustomDialog, CustomDrawer } from 'components/common';
import PrivateRoutes from './PrivateRoutes';
import { Login } from './components/view';
import { CreateStore, RootStore } from 'stores';
import { ScreenType, PlaceDataType } from 'types/typeBundle';
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
    LocationStore,
  } = MobxStore;
  const { ref, width, height } = useResizeObserver();
  const history = createBrowserHistory();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

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
    try {
      const { code, latitude, longitude } = JSON.parse(data);
      if (code !== 'success' || !latitude || !longitude) return;
      UserNavigatorStore.setUserLocation([latitude, longitude], true);
    } catch {
      UserNavigatorStore.setUserLocation([37.625638, 127.038941], false);
    }
  };

  const onGeolocationSuccess = ({
    coords,
  }: {
    coords: { latitude: number; longitude: number };
  }) => {
    const { latitude, longitude } = coords;
    UserNavigatorStore.setUserLocation([latitude, longitude], true);
    UserNavigatorStore.setLoaded(true);
  };

  const initPlaceData = useCallback(async () => {
    const params = { populationSort: true };
    const placeData: { data: { list: PlaceDataType[] } } | undefined = await axiosRequest(
      'get',
      'place',
      params
    );
    if (!placeData) return;
    CustomDrawerStore.setPlaceData([...placeData.data.list]);
    [...placeData.data.list].forEach((data: PlaceDataType) => {
      LocationStore.setCategories(data.name, data.categories);
    });
  }, [CustomDrawerStore, LocationStore]);

  useEffect(() => {
    initPlaceData();
  }, [initPlaceData]);

  useEffect(() => {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      disableIosInputAutoZoom();
    }
  }, []);

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
    if ((window as unknown as { ReactNativeWebView: unknown }).ReactNativeWebView) {
      document.addEventListener('message', reactNativeListener); // android
      window.addEventListener('message', reactNativeListener); // ios
      return;
    }
    if (!navigator.geolocation) return;
    navigator.geolocation.watchPosition(onGeolocationSuccess);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reissueToken = useCallback(
    async (refreshToken: string) => {
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

  useEffect(() => {
    if (AuthStore.authorized || AuthStore.isLoggingIn) return;
    const refreshToken = localStorage.getItem('@wagglewaggle_refresh_token');
    if (refreshToken) {
      reissueToken(refreshToken);
      return;
    }
  }, [AuthStore, AuthStore.authorized, reissueToken]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CreateStore.Provider value={{ MobxStore }}>
        <ServiceWrap ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/*' element={<PrivateRoutes />} />
            </Routes>
            <CustomDrawer />
          </BrowserRouter>
        </ServiceWrap>
        <CustomDialog />
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
}));

const ServiceWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 768,
  height: 'fit-content',
  minHeight: '100vh',
});
