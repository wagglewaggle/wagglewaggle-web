import { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import useResizeObserver from 'use-resize-observer';
import { styled } from '@mui/material';
import { CustomDialog, CustomDrawer } from 'components/common';
import { Login, Register, List, Map, Error } from './components/view';
import { CreateStore, RootStore } from 'stores';
import { ScreenType, PlaceDataType } from 'types/typeBundle';
import axiosRequest from 'api/axiosRequest';
import { palette } from 'constants/';

export const MobxStore = new RootStore();

const App = observer(() => {
  const { ScreenSizeStore, ThemeStore, UserNavigatorStore, CustomDrawerStore, LocationStore } =
    MobxStore;
  const { ref, width } = useResizeObserver();
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
      UserNavigatorStore.setUserLocation([latitude, longitude]);
    } catch {
      UserNavigatorStore.setUserLocation([37.625638, 127.038941]);
    }
  };

  const onGeolocationSuccess = ({
    coords,
  }: {
    coords: { latitude: number; longitude: number };
  }) => {
    const { latitude, longitude } = coords;
    UserNavigatorStore.setUserLocation([latitude, longitude]);
    UserNavigatorStore.setLoaded(true);
  };

  const initPlaceData = useCallback(async () => {
    const params = { populationSort: true };
    const placeData: { data: { list: PlaceDataType[] } } | undefined = await axiosRequest(
      'place',
      params
    );
    if (!placeData) return;
    const statusArr: string[] = [
      'VERY_RELAXATION',
      'RELAXATION',
      'NORMAL',
      'CROWDED',
      'VERY_CROWDED',
    ];
    CustomDrawerStore.setPlaceData(
      [...placeData.data.list].sort((prev: PlaceDataType, next: PlaceDataType) => {
        const prevLevel = statusArr.indexOf(prev.population.level);
        const nextLevel = statusArr.indexOf(next.population.level);
        if (prevLevel > nextLevel) return -1;
        else if (nextLevel > prevLevel) return 1;
        return 0;
      })
    );
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
    if (!width) return;
    const screenType: ScreenType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'pc';
    ScreenSizeStore.setScreenType(screenType);
    ScreenSizeStore.setScreenWidth(width);
  }, [ScreenSizeStore, width]);

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

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CreateStore.Provider value={{ MobxStore }}>
        <ServiceWrap ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/auth/naver/callback' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/map/*' element={<Map />} />
              <Route path='/list/*' element={<List />} />
              <Route path='/not-found' element={<Error />} />
              <Route path='/error' element={<Error />} />
              <Route path='/api/auth/naver/redirect/*' element={<Login />} />
              <Route path='/api/auth/kakao/redirect/*' element={<Login />} />
              <Route path='/api/auth/google/redirect/*' element={<Login />} />
              <Route path='/' element={<Navigate to='/login' />} />
              <Route path='/*' element={<Navigate to='/not-found' />} />
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
