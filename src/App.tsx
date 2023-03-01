import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import useResizeObserver from 'use-resize-observer';
import { styled } from '@mui/material';
import { CustomDialog } from 'components/common';
import { Login, Main, Error } from './components/view';
import { CreateStore, RootStore } from 'stores';
import { ScreenType } from 'types/typeBundle';
import { palette } from 'constants/';

export const MobxStore = new RootStore();

const App = observer(() => {
  const { ScreenSizeStore, ThemeStore } = MobxStore;
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

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CreateStore.Provider value={{ MobxStore }}>
        <ServiceWrap ref={ref}>
          <BrowserRouter>
            <Routes>
              <Route path='/login' element={<Login />} />
              <Route path='/auth/naver/callback' element={<Login />} />
              <Route path='/main/*' element={<Main />} />
              <Route path='/not-found' element={<Error />} />
              <Route path='/error' element={<Error />} />
              <Route path='/' element={<Navigate to='/login' />} />
              <Route path='/*' element={<Navigate to='/not-found' />} />
            </Routes>
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
  maxWidth: 1024,
  height: 'fit-content',
  minHeight: '100vh',
});
