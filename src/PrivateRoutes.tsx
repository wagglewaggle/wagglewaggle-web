import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { LinkCopyPopup } from 'components/common';
import { Login, Register, List, Map, Review, Error } from './components/view';
import { useStore } from 'stores';
import linkCheckIcon from 'assets/icons/link-check-icon.svg';

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { AuthStore, UserNavigatorStore, ThemeStore } = useStore().MobxStore;
  const { deepLinkUrl } = UserNavigatorStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isWebView = !!(window as unknown as { ReactNativeWebView: unknown }).ReactNativeWebView;

  useEffect(() => {
    if (AuthStore.authorized || sessionStorage.getItem('@wagglewaggle_authorized')) return;
    if (!sessionStorage.getItem('@wagglewaggle_navigate')) {
      sessionStorage.setItem('@wagglewaggle_navigate', `${pathname}${search}`);
    }
    navigate('/login');
  }, [AuthStore.authorized, navigate, pathname, search]);

  useEffect(() => {
    if (!isWebView || !deepLinkUrl) return;
    if (['wagglewaggle://', 'exp://192.168.45.139:19000'].includes(deepLinkUrl)) return;
    const productModeScheme = 'wagglewaggle:/';
    const devModeScheme = 'exp://192.168.45.139:19000/--';
    const navigateUrl = deepLinkUrl.includes(productModeScheme)
      ? deepLinkUrl.replace(productModeScheme, '')
      : deepLinkUrl.replace(devModeScheme, '');
    navigate(navigateUrl || '');
    UserNavigatorStore.setDeepLinkUrl(null);
  }, [UserNavigatorStore, isWebView, deepLinkUrl, navigate]);

  return (
    <Wrap>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/map/*' element={<Map />} />
        <Route path='/list/*' element={<List />} />
        <Route path='/review/*' element={<Review />} />
        <Route path='/not-found' element={<Error />} />
        <Route path='/error' element={<Error />} />
        <Route path='/api/auth/naver/redirect/*' element={<Login />} />
        <Route path='/api/auth/kakao/redirect/*' element={<Login />} />
        <Route path='/api/auth/apple/redirect/*' element={<Login />} />
        <Route path='/api/auth/google/redirect/*' element={<Login />} />
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/*' element={<Navigate to='/not-found' />} />
      </Routes>
      {UserNavigatorStore.shouldLinkPopupAppear && (
        <LinkCopyPopup isDarkTheme={isDarkTheme}>
          <img src={linkCheckIcon} alt='link-copy-check' />
          링크가 복사되었습니다.
        </LinkCopyPopup>
      )}
    </Wrap>
  );
};

export default observer(PrivateRoutes);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: 'fit-content',
  minHeight: '100vh',
});
