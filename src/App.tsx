import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useResizeObserver from 'use-resize-observer';
import makeStyles from '@mui/styles/makeStyles';
import { Main } from './components/view';
import { RootStore } from 'stores';
import { screenType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 360,
    backgroundColor: palette.black,
    overflow: 'hidden',
  },
  serviceWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1024,
    height: 'fit-content',
    minHeight: '100vh',
  },
}));

export const MobxStore = new RootStore();

const App = () => {
  const classes = useStyles();
  const { ScreenSizeStore } = MobxStore;
  const { ref, width } = useResizeObserver();

  useEffect(() => {
    if (!width) return;
    const screenType: screenType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'pc';
    ScreenSizeStore.setScreenType(screenType);
  }, [ScreenSizeStore, width]);

  return (
    <div className={classes.wrap}>
      <div className={classes.serviceWrap} ref={ref}>
        <BrowserRouter>
          <Routes>
            <Route path='/main/*' element={<Main />} />
            <Route path='/*' element={<Navigate to='/main' />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
