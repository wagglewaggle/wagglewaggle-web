import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Main, Detail } from './components/view';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: palette.black,
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

const App = () => {
  const classes = useStyles();

  const registerKakaoAppKey = () => {};

  useEffect(() => {
    registerKakaoAppKey();
  }, []);

  return (
    <div className={classes.wrap}>
      <div className={classes.serviceWrap}>
        <BrowserRouter>
          <Routes>
            <Route path='/main/*' element={<Main />} />
            <Route path='/detail/*' element={<Detail />} />
            <Route path='/*' element={<Navigate to='/main' />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
