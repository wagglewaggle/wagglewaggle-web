import { useLayoutEffect, useEffect, useMemo } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import useResizeObserver from 'use-resize-observer';
import { GlobalStyles, styled } from '@mui/material';
import { CustomDialog } from 'components/common';
// import { Main, Error } from './components/view';
import { Landing } from 'components/landing';
import { CreateStore, RootStore } from 'stores';
import { ScreenType } from 'types/typeBundle';
import { palette } from 'constants/';

export const MobxStore = new RootStore();

const App = observer(() => {
  const { ScreenSizeStore, ThemeStore } = MobxStore;
  const { ref, width } = useResizeObserver();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const projectStatusSessionStorageKey = useMemo(() => '@wagglewaggle_project_status', []);

  const scrollbarDesign = useMemo(
    () => ({
      '&::-webkit-scrollbar': {
        width: '10px',
        color: palette.grey[isDarkTheme ? 500 : 300],
        background: isDarkTheme ? palette.grey[700] : palette.white,
      },
      '&::-webkit-scrollbar-thumb': {
        borderLeft: `3px solid ${isDarkTheme ? palette.grey[700] : palette.white}`,
        borderRight: `3px solid ${isDarkTheme ? palette.grey[700] : palette.white}`,
        borderRadius: '0.25rem',
        backgroundColor: palette.grey[isDarkTheme ? 500 : 300],
      },
      '&::-webkit-scrollbar-track': {
        background: isDarkTheme ? palette.grey[700] : palette.white,
      },
    }),
    [isDarkTheme]
  );

  const disableIosInputAutoZoom = () => {
    const metaEl = document.querySelector('meta[name=viewport]');
    if (!metaEl) return;
    const newContentArr: string[] = (metaEl as unknown as { content: string }).content.split(', ');
    const maximumScaleContent: string = 'maximum-scale=1';
    if (newContentArr.includes(maximumScaleContent)) return;
    newContentArr.push(maximumScaleContent);
    metaEl.setAttribute('content', newContentArr.join(', '));
  };

  useLayoutEffect(() => {
    if (sessionStorage.getItem(projectStatusSessionStorageKey) === 'timer') return;
    if (sessionStorage.getItem(projectStatusSessionStorageKey) === 'released') return;
    sessionStorage.setItem(projectStatusSessionStorageKey, 'released');
  }, [projectStatusSessionStorageKey]);

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
      <GlobalStyles styles={scrollbarDesign} />
      <CreateStore.Provider value={{ MobxStore }}>
        <ServiceWrap ref={ref} status='timer'>
          <Landing />
          {/* {sessionStorage.getItem(projectStatusSessionStorageKey) === 'timer' ? (
            <Landing />
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path='/not-found' element={<Error />} />
                <Route path='/error' element={<Error />} />
                <Route path='/' element={<Main />} />
                <Route path='/detail/*' element={<Main />} />
                <Route path='/*' element={<Navigate to='/not-found' />} />
              </Routes>
            </BrowserRouter>
          )} */}
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

const ServiceWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'status',
})<{ status?: string | null }>(({ status }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: status === 'timer' ? 'unset' : 1024,
  height: 'fit-content',
  minHeight: '100vh',
}));
