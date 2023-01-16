import { styled } from '@mui/material';
import rightIcon from 'assets/icons/right-icon.svg';

const IntroContent = () => {
  const openSurveyPage = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSenqtgHZbuI5RIOYXzYE4217OcZco2Uxb44xl_zHQ_DQAj9Iw/viewform',
      '_blank'
    );
  };

  return (
    <>
      <Title>와글와글에게 여러분의 목소리를 들려주세요.</Title>
      <Content>
        와글와글을 더욱 더 발전시키기 위해 사용자 인터뷰 대상자를 모집합니다. 참여해주신 분들에겐
        소정의 사례금을 드립니다.
        <br />
        많은 참여 부탁드립니다 🐰
        <br />
        <br />
        <Survey onClick={openSurveyPage}>
          참여하기 <img src={rightIcon} alt='right' />
        </Survey>
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

const Survey = styled('span')({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 700,
  gap: 4,
  cursor: 'pointer',
  '& img': {
    width: 16,
    height: 16,
  },
});
