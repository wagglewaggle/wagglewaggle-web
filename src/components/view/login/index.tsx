import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import lottie from 'lottie-web';
import googleIcon from 'assets/icons/login/google.png';
import kakaoIcon from 'assets/icons/login/kakao.png';
import naverIcon from 'assets/icons/login/naver.png';
import { ReactComponent as WaggleWaggleLogo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as CheckIcon } from 'assets/icons/login/check.svg';
import { palette } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import { useStore } from 'stores';

const Login = () => {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { AuthStore, ThemeStore } = useStore().MobxStore;
  const { autoLoginChecked } = AuthStore;

  const handleAutoLoginClick = () => {
    AuthStore.setAutoLoginChecked();
  };

  const handleLoggedIn = useCallback(
    (userExists: boolean) => {
      navigate(
        sessionStorage.getItem('@wagglewaggle_navigate') ?? `/${userExists ? 'map' : 'register'}`
      );
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

  const handleGoogleClick = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${window.location.origin}/${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`,
      '_self'
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

  useEffect(() => {
    const authCode = searchParams.get('code');
    const platform = pathname.split('/')?.[3] ?? null;
    if (!authCode || !platform) return;
    if (AuthStore.isLoggingIn) return;
    requestJwt(authCode, platform);
  }, [AuthStore, searchParams, pathname, navigate, requestJwt]);

  useEffect(() => {
    if (!AuthStore.authorized) return;
    handleLoggedIn(true);
  }, [AuthStore.authorized, handleLoggedIn]);

  useEffect(() => {
    AuthStore.initAutoLoginChecked();
  }, [AuthStore]);

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/${ThemeStore.theme}/Character.json`),
    });
    return () => lottie.destroy();
  }, [ThemeStore.theme]);

  return (
    <Wrap>
      <CustomWaggleWaggleLogo />
      <Lottie ref={lottieContainer}></Lottie>
      <ButtonWrap variant='kakao' onClick={handleKakaoClick}>
        <CustomImgButton src={kakaoIcon} alt='kakao' />
        카카오로 로그인
      </ButtonWrap>
      <ButtonWrap variant='naver' onClick={handleNaverClick}>
        <CustomImgButton src={naverIcon} alt='naver' />
        네이버로 로그인
      </ButtonWrap>
      <ButtonWrap variant='google' onClick={handleGoogleClick}>
        <CustomImgButton src={googleIcon} alt='google' />
        Google로 로그인
      </ButtonWrap>
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

const Lottie = styled('div')({
  margin: '16px 0 35px',
  width: 245,
  height: 225,
});

const CustomWaggleWaggleLogo = styled(WaggleWaggleLogo)({
  width: 206,
  height: 100,
});

const ButtonWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ variant: 'kakao' | 'naver' | 'google' }>(({ variant }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${variant === 'google' ? palette.grey[400] : palette[variant]}`,
  borderRadius: 4,
  width: '100%',
  height: 60,
  color: variant === 'naver' ? palette.white : palette.black,
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
