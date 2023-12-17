import { styled } from '@mui/material';

const IntroContent = () => {
  return (
    <>
      <Title>{`2023년 크리스마스를\n와글와글과 함께 즐겨보세요.`}</Title>
      <Content>
        {`‘와글와글’을 통해 크리스마스를 즐길 수 있는 인기 장소별 인구 혼잡 현황을 확인해보세요 👨‍👩‍👧‍👦`}
      </Content>
    </>
  );
};

export default IntroContent;

const Title = styled('div')({
  marginBottom: '1rem',
  fontSize: '1.125rem',
  fontWeight: 600,
  whiteSpace: 'pre-line',
  wordBreak: 'keep-all',
  lineHeight: '1.5rem',
});

const Content = styled('div')({
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
  whiteSpace: 'pre-line',
  wordBreak: 'keep-all',
});
