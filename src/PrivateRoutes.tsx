import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { Login, Register, List, Map, Review, Error } from './components/view';
import { useStore } from 'stores';

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { AuthStore } = useStore().MobxStore;

  useEffect(() => {
    if (AuthStore.authorized || sessionStorage.getItem('@wagglewaggle_authorized')) return;
    if (!sessionStorage.getItem('@wagglewaggle_navigate')) {
      sessionStorage.setItem('@wagglewaggle_navigate', `${pathname}${search}`);
    }
    navigate('/login');
  }, [AuthStore.authorized, navigate, pathname, search]);

  return (
    <Wrap>
      <Routes>
        <Route path='/auth/naver/callback' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/map/*' element={<Map />} />
        <Route path='/list/*' element={<List />} />
        <Route path='/review/*' element={<Review />} />
        <Route path='/not-found' element={<Error />} />
        <Route path='/error' element={<Error />} />
        <Route path='/api/auth/naver/redirect/*' element={<Login />} />
        <Route path='/api/auth/kakao/redirect/*' element={<Login />} />
        <Route path='/api/auth/google/redirect/*' element={<Login />} />
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/*' element={<Navigate to='/not-found' />} />
      </Routes>
    </Wrap>
  );
};

export default observer(PrivateRoutes);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: 430,
  height: 'fit-content',
  minHeight: '100vh',
});
