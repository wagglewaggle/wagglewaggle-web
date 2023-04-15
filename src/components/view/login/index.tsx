import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { isIOS, isAndroid } from 'react-device-detect';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import LoginMainImage from 'assets/icons/login/login-main.png';
import kakaoIcon from 'assets/icons/login/kakao.png';
import naverIcon from 'assets/icons/login/naver.png';
import googleIcon from 'assets/icons/login/google.png';
import appleIcon from 'assets/icons/login/apple.png';
import { ReactComponent as WaggleWaggleLogo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as CheckIcon } from 'assets/icons/login/check.svg';
import { palette } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import { useStore } from 'stores';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { AuthStore, CustomDialogStore, UserNavigatorStore } = useStore().MobxStore;
  const { autoLoginChecked, isLoggingIn, authorized } = AuthStore;
  const { deepLinkUrl } = UserNavigatorStore;
  const isWebView = !!(window as unknown as { ReactNativeWebView: unknown }).ReactNativeWebView;

  const handleAutoLoginClick = () => {
    AuthStore.setAutoLoginChecked();
  };

  const handleLoggedIn = useCallback(
    (userExists: boolean) => {
      const privateRoutePath = sessionStorage.getItem('@wagglewaggle_navigate') ?? '/map';
      navigate(userExists ? privateRoutePath : '/register', { replace: true });
      sessionStorage.removeItem('@wagglewaggle_navigate');
    },
    [navigate]
  );

  const handleKakaoClick = () => {
    const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    window.open(
      `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${window.location.origin}/${redirectUri}`,
      '_self'
    );
  };

  const handleNaverClick = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URI;
    window.open(
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${window.location.origin}/${redirectUri}&state=test`,
      '_self'
    );
  };

  const handleAppleClick = () => {
    const clientId = process.env.REACT_APP_APPLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_APPLE_REDIRECT_URI;
    window.open(
      `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=https://wagglewaggle.co.kr/${redirectUri}&response_type=code%20id_token&scope=name%20email&response_mode=form_post`,
      '_self'
    );
  };

  const handleGoogleClick = () => {
    localStorage.removeItem('@wagglewaggle_google_oauth_tried');
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=https://wagglewaggle.co.kr/${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`,
      '_blank'
    );
  };

  const requestJwt = useCallback(
    async (authCode: string, platform: string) => {
      AuthStore.setIsLoggingIn(true);
      const response = await axiosRequest('get', `auth/${platform}?code=${authCode}`);
      AuthStore.setIsLoggingIn(false);
      const { accessToken, refreshToken, existUser } = response?.data;
      if (!accessToken || !refreshToken) return;

      AuthStore.setAuthorized(true);
      handleLoggedIn(existUser);
    },
    [AuthStore, handleLoggedIn]
  );

  const handleCloseDialog = useCallback(() => {
    CustomDialogStore.setOpen(false);
  }, [CustomDialogStore]);

  useEffect(() => {
    if (!sessionStorage.getItem('@wagglewaggle_login_failed')) return;
    CustomDialogStore.openNotificationDialog({
      title: '로그인 오류',
      content: '로그인하는 데에 오류가 발생했습니다.\n다시 로그인해 주세요.',
      rightButton: {
        title: '확인',
        handleClick: handleCloseDialog,
      },
    });
    sessionStorage.removeItem('@wagglewaggle_login_failed');
  }, [CustomDialogStore, handleCloseDialog]);

  useEffect(() => {
    const authCode = searchParams.get('code');
    const platform = pathname.split('/')?.[3] ?? null;
    if (!authCode || !platform) return;
    if (isLoggingIn || authorized) return;
    requestJwt(authCode, platform);
  }, [isLoggingIn, authorized, searchParams, pathname, requestJwt]);

  useEffect(() => {
    AuthStore.initAutoLoginChecked();
  }, [AuthStore]);

  useEffect(() => {
    if (!AuthStore.authorized) return;
    handleLoggedIn(true);
  }, [AuthStore.authorized, handleLoggedIn]);

  useEffect(() => {
    if (localStorage.getItem('@wagglewaggle_google_oauth_tried')) return;
    if (!isWebView || !deepLinkUrl) return;
    if (['wagglewaggle://', 'exp://192.168.45.139:19000'].includes(deepLinkUrl)) return;
    const productModeScheme = 'wagglewaggle:/';
    const devModeScheme = 'exp://192.168.45.139:19000/--';
    const requestUrl = deepLinkUrl.includes(productModeScheme)
      ? deepLinkUrl.replace(productModeScheme, '')
      : deepLinkUrl.replace(devModeScheme, '');
    localStorage.setItem('@wagglewaggle_google_oauth_tried', 'true');
    requestJwt(
      requestUrl.replace(`/${process.env.REACT_APP_GOOGLE_REDIRECT_URI}?code=`, ''),
      'google'
    );
    UserNavigatorStore.setDeepLinkUrl(null);
  }, [UserNavigatorStore, isWebView, deepLinkUrl, requestJwt]);

  return (
    <Wrap>
      <CustomWaggleWaggleLogo />
      <MainImage src={LoginMainImage} alt='login-main'></MainImage>
      <ButtonWrap variant='kakao' onClick={handleKakaoClick}>
        <CustomImgButton src={kakaoIcon} alt='kakao' />
        카카오로 로그인
      </ButtonWrap>
      <ButtonWrap variant='naver' onClick={handleNaverClick}>
        <CustomImgButton src={naverIcon} alt='naver' />
        네이버로 로그인
      </ButtonWrap>
      {isIOS && (
        <ButtonWrap variant='apple' onClick={handleAppleClick}>
          <CustomImgButton src={appleIcon} alt='apple' />
          Apple로 로그인
        </ButtonWrap>
      )}
      {isAndroid && (
        <ButtonWrap variant='google' onClick={handleGoogleClick}>
          <CustomImgButton src={googleIcon} alt='google' />
          Google로 로그인
        </ButtonWrap>
      )}
      <OptionWrap onClick={handleAutoLoginClick}>
        <CustomCheckIcon autoLoginChecked={autoLoginChecked} />
        자동 로그인
      </OptionWrap>
    </Wrap>
  );
};

export default observer(Login);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: 327,
  maxWidth: 327,
  height: '100vh',
  whiteSpace: 'pre-line',
  gap: 8,
});

const MainImage = styled('img')({
  margin: '77px 0 20px',
  width: 327,
  height: 193,
});

const CustomWaggleWaggleLogo = styled(WaggleWaggleLogo)({
  width: 206,
  height: 100,
});

const ButtonWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ variant: 'kakao' | 'naver' | 'apple' | 'google' }>(({ variant }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${variant === 'google' ? palette.grey[400] : palette[variant]}`,
  borderRadius: 4,
  width: '100%',
  height: 52,
  color: ['naver', 'apple'].includes(variant) ? palette.white : palette.black,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  backgroundColor: palette[variant],
  gap: 8,
  cursor: 'pointer',
}));

const CustomImgButton = styled('img')({
  width: 36,
  height: 36,
});

const OptionWrap = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  margin: '24px 0',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  gap: 8,
  cursor: 'pointer',
});

const CustomCheckIcon = styled(CheckIcon, {
  shouldForwardProp: (prop: string) => prop !== 'autoLoginChecked',
})<{ autoLoginChecked: boolean }>(({ autoLoginChecked }) => ({
  width: 20,
  height: 20,
  path: {
    fill: autoLoginChecked ? palette.violet : palette.grey[400],
  },
}));
