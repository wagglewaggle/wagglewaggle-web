import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Main, Detail } from './components/view';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  serviceWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrap}>
      <div className={classes.serviceWrap}>
        <BrowserRouter>
          <Routes>
            <Route path='/main/*' element={<Main />} />
            <Route path='/detail/*' element={<Detail />} />
            <Route path='/' element={<Navigate to='/main' />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
