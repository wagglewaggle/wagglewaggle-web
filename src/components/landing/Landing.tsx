import { observer } from 'mobx-react';
import { useStore } from 'stores';
import { Footer } from 'components/common';
import * as S from './styled';
import { ReactComponent as Bell } from 'assets/icons/bell.svg';

export default observer(() => {
  const { ScreenSizeStore } = useStore().MobxStore;
  const { screenType } = ScreenSizeStore;

  const handleClickButton = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSd80kqdw5LAvGWEYN1Wz0lvKkbryGDqTEuYKYhfINLQGeOx7Q/viewform?usp=sf_link',
      '_blank'
    );
  };

  return (
    <S.Wrap>
      <S.Logo />
      <S.Title screenType={screenType}>
        {`여의도 불꽃 축제\n눈치 싸움에${screenType === 'mobile' ? '\n' : ' '}성공하고 싶다면?`}
      </S.Title>
      <S.Description screenType={screenType}>
        와글와글에서는 여의도 불꽃 축제 명당의혼잡도를 한눈에 확인할 수 있어요.
      </S.Description>
      <S.Description screenType={screenType}>
        와글와글은 불꽃 축제가 열리는 <strong>2023년10월 7일 오전 12시</strong>에 오픈될 예정이에요.
      </S.Description>
      <S.Description screenType={screenType}>
        서비스 오픈 시 알림을 받고 싶다면 지금 바로 신청해주세요!
      </S.Description>
      <S.CustomButton screenType={screenType} onClick={handleClickButton}>
        <Bell />
        <span>오픈 알림 신청</span>
      </S.CustomButton>
      <Footer />
    </S.Wrap>
  );
});
