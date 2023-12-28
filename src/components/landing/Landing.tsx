import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import lottie from 'lottie-web';
import { useStore } from 'stores';
import { Footer } from 'components/common';
import * as S from './styled';
import mobileBg from 'assets/landing/landing-mobile.png';
import pcBg from 'assets/landing/landing-pc.png';

export default observer(() => {
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { ScreenSizeStore } = useStore().MobxStore;
  const { screenType, screenWidth } = ScreenSizeStore;

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
        <S.Title screenType={screenType}>{`와글와글 서비스${
          screenType === 'mobile' ? '\n' : ''
        }종료 알림`}</S.Title>
        <S.Description screenType={screenType}>
          2023년 12월 31일로 운영 이슈로 와글와글 서비스를 운영 종료하게 되었습니다.
        </S.Description>
        <S.Description screenType={screenType}>
          그동안 와글와글을 사랑해주신 여러분들께 감사드립니다.
        </S.Description>
        <S.Description screenType={screenType}>
          좋은 기회가 된다면 다른 서비스로 만나요!
        </S.Description>
      </S.Content>
      <Footer />
    </S.Wrap>
  );
});
