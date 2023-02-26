import { styled } from '@mui/material';

const IntroContent = () => {
  return (
    <>
      <Title>와글와글에 오신 것을 환영합니다.</Title>
      <Content>
        {`웹에서 검색해서 들어오시기 불편하셨죠?\r\n지금 와글와글은 앱으로 예쁘게 단장 중 🤗\r\n추후 앱스토어에서 ‘와글와글’을 검색해보세요!`}
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
  textAlign: 'center',
});

const Content = styled('div')({
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
});
