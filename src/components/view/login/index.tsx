import { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material';
import googleIcon from 'assets/icons/login/google.png';
import kakaoIcon from 'assets/icons/login/kakao.png';
import naverIcon from 'assets/icons/login/naver.png';
import loginIllust from 'assets/icons/login/login-illust.png';
import { palette } from 'constants/';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleKakaoClick = () => {
    navigate('/register');
  };

  const handleNaverClick = () => {
    // const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    // const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URI;
    // window.open(
    //   `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=test`
    // );
    navigate('/list');
  };

  const handleGoogleClick = () => {
    navigate('/list');
  };

  const requestJwt = useCallback(async (authCode: string) => {
    console.log(await fetch(`http://54.180.151.30:3000/api/auth/naver?code=${authCode}`));
  }, []);

  useEffect(() => {
    const authCode = searchParams.get('code');
    if (!authCode) return;

    requestJwt(authCode);
    navigate('/login');
  }, [searchParams, navigate, requestJwt]);

  return (
    <Wrap>
      <Header>
        {`와글와글에 오신 것을\r\n 환영합니다.`}
        <SubHeader>
          {`지금 가려는 곳의 혼잡도가 궁금하다면\r\n와글와글에서 확인해보세요.`}
        </SubHeader>
      </Header>
      <LoginImage src={loginIllust} alt='login-image' />
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
    </Wrap>
  );
};

export default Login;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 327,
  maxWidth: 327,
  height: '100vh',
  whiteSpace: 'pre-line',
  gap: 16,
});

const Header = styled('h1')({
  margin: '32px 0 0',
  width: '100%',
  color: palette.black,
  fontSize: 24,
  fontWeight: 600,
  lineHeight: '32px',
});

const SubHeader = styled('h5')({
  margin: '16px 0 0',
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});

const LoginImage = styled('img')({
  margin: '16px 0',
  width: '100%',
  height: 262,
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
