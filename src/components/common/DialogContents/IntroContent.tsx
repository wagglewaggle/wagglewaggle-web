import { styled } from '@mui/material';

const IntroContent = () => {
  return (
    <>
      <Title>와글와글에 오신 것을 환영합니다.</Title>
      <Content>
        ‘와글와글’은 SKT와 KT에서 제공하는 인구 혼잡도 데이터를 기반으로, 서울 및 경기도 내 주요
        공간별 인구 혼잡 현황을 알려드립니다. 보고 싶은 위치를 선택하여 그곳의 실시간 인구 혼잡
        현황을 확인해보세요.
      </Content>
    </>
  );
};

export default IntroContent;

const Title = styled('div')({
  marginBottom: '16px',
  fontSize: 18,
  fontWeight: 600,
  wordBreak: 'keep-all',
  lineHeight: '24px',
});

const Content = styled('div')({
  lineHeight: '20px',
});
