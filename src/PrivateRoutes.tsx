import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Login, Register, List, Map, Error } from './components/view';
import { useStore } from 'stores';

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { AuthStore } = useStore().MobxStore;

  useEffect(() => {
    if (AuthStore.authorized || sessionStorage.getItem('@wagglewaggle_authorized')) return;
    navigate('/login');
  }, [AuthStore.authorized, navigate]);

  return (
    <Routes>
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
  );
};

export default observer(PrivateRoutes);
