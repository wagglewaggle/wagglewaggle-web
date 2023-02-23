import { useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material';
import googleIcon from 'assets/icons/login/google.png';
import kakaoIcon from 'assets/icons/login/kakao.png';
import naverIcon from 'assets/icons/login/naver.png';
import axiosRequest from 'api/axiosRequest';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleNaverClick = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URI;
    window.open(
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=test`
    );
  };

  const requestJwt = useCallback(async (authCode: string) => {
    console.log(await fetch(`http://54.180.151.30:3000/api/auth/naver?code=${authCode}`));
  }, []);

  useEffect(() => {
    const authCode = searchParams.get('code');
    if (!authCode) return;

    requestJwt(authCode);
    navigate('/login');
  }, [navigate, requestJwt]);

  return (
    <Wrap>
      <ButtonWrap>
        <CustomImgButton src={googleIcon} alt='google' />
        구글
      </ButtonWrap>
      <ButtonWrap>
        <CustomImgButton src={kakaoIcon} alt='kakao' />
        카카오
      </ButtonWrap>
      <ButtonWrap>
        <CustomImgButton src={naverIcon} alt='naver' onClick={handleNaverClick} />
        네이버
      </ButtonWrap>
    </Wrap>
  );
};

export default Login;

const Wrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: 264,
  height: '100vh',
});

const ButtonWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: 16,
});

const CustomImgButton = styled('img')({
  width: 48,
  height: 48,
  cursor: 'pointer',
});
