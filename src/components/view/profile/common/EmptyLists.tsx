import { useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import lottie from 'lottie-web';
import { useStore } from 'stores';
import { palette } from 'constants/';

type PropsType = {
  title: string;
  content: string;
};

const EmptyLists = (props: PropsType) => {
  const { title, content } = props;
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { ThemeStore } = useStore().MobxStore;

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
    <NoReviewWrap>
      <Lottie ref={lottieContainer}></Lottie>
      <NoReviewHeader>{title}</NoReviewHeader>
      <NoReviewContent>{content}</NoReviewContent>
    </NoReviewWrap>
  );
};

export default observer(EmptyLists);

const NoReviewWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
  gap: 8,
});

const Lottie = styled('div')({
  margin: '40px 0 16px',
  width: 120,
  height: 120,
});

const NoReviewHeader = styled('span')({
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const NoReviewContent = styled('span')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
});
