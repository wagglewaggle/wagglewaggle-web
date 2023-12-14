import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import lottie from 'lottie-web';
import { useStore } from 'stores';
import { Footer } from 'components/common';
import * as S from './styled';
import { ReactComponent as Bell } from 'assets/icons/bell.svg';
import mobileBg from 'assets/landing/landing-mobile.png';
import pcBg from 'assets/landing/landing-pc.png';

export default observer(() => {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { ScreenSizeStore } = useStore().MobxStore;
  const { screenType, screenWidth } = ScreenSizeStore;

  const handleClickButton = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLScLQZz427IZZOJMsM6srURu91ZhDi0UweMhzgarz1b28ec4Kw/viewform?usp=sf_link',
      '_blank'
    );
  };

  useEffect(() => {
    if (!lottieContainer.current) return;
    const introAnimation = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/landing/background-${
        screenType === 'mobile' ? 'mobile' : 'pc'
      }.json`),
    });
    return () => introAnimation.destroy();
  }, [screenType]);

  return (
    <>
      <S.Wrap>
        <S.BackgroundWrap>
          <S.BackgroundImage
            screenWidth={screenWidth}
            src={screenType === 'pc' ? pcBg : mobileBg}
            alt='landing-bg'
          />
        </S.BackgroundWrap>
        <S.Lottie ref={lottieContainer} screenType={screenType} />
        <S.Logo />
        <S.Content>
          <S.Title screenType={screenType}>{'크리스마스 이브에\n다시 돌아올게요!'}</S.Title>
          <S.Description screenType={screenType}>
            와글와글은 <strong>2023년 12월 22일 오전 12시</strong>에 다시 돌아올 예정이에요.
          </S.Description>
          <S.Description screenType={screenType}>
            서비스 오픈 시 알림을 받고 싶다면 지금 바로 신청해주세요!
          </S.Description>
          <S.CustomButton screenType={screenType} onClick={handleClickButton}>
            <Bell />
            <span>오픈 알림 신청</span>
          </S.CustomButton>
        </S.Content>
        <Footer />
      </S.Wrap>
    </>
  );
});
