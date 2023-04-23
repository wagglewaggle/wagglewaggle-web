import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import BrowserPageFooter from './BrowserPageFooter';
import Content from './Content';
import { ReactComponent as Logo } from 'assets/icons/logo-filled-icon.svg';
import appStore from 'assets/browserPage/app-store.png';
import googlePlay from 'assets/browserPage/google-play.png';
import oneStore from 'assets/browserPage/one-store.png';
import content1 from 'assets/browserPage/content-image-1.png';
import content2 from 'assets/browserPage/content-image-2.png';
import content3 from 'assets/browserPage/content-image-3.png';
import content3_1 from 'assets/browserPage/content-image-3-1.png';
import locationIcon from 'assets/browserPage/location.svg';
import personIcon from 'assets/browserPage/person.svg';
import chatIcon from 'assets/browserPage/chat.svg';
import { palette } from 'constants/';

export type ContentPropsType = {
  idx: number;
  headerLogo: string;
  title: string;
  content: string;
  contentImage: string;
  subContentImage?: string;
  shadyBackground: boolean;
};

const BrowserPage = () => {
  const { ScreenSizeStore } = useStore().MobxStore;
  const { screenWidth } = ScreenSizeStore;
  const device = screenWidth < 768 ? 'mobile' : screenWidth < 1024 ? 'tablet' : 'pc';
  const bgImage = require(`assets/browserPage/${device}-header-bg.png`);

  const handleAppleClick = () => {
    window.open(
      'https://apps.apple.com/us/app/%EC%99%80%EA%B8%80%EC%99%80%EA%B8%80-wagglewaggle/id1672827485',
      '_blank'
    );
  };

  const handleGoogleClick = () => {
    window.open('https://play.google.com/store/apps/details?id=com.exit.wagglewaggle', '_blank');
  };

  const handleOnestoreClick = () => {
    window.open(
      'https://m.onestore.co.kr/mobilepoc/apps/appsDetail.omp?prodId=0000768743',
      '_blank'
    );
  };

  return (
    <>
      <HeaderImage src={bgImage} alt='header-bg' device={device} />
      <HeaderWrap device={device}>
        <CustomLogo />
        <HeaderText device={device}>
          {`지금 그곳의${device === 'mobile' ? '\r\n' : ' '}혼잡도가 궁금하면\r\n와글와글에서`}
        </HeaderText>
        <ButtonsArea>
          <AppImage src={appStore} alt='app-store' onClick={handleAppleClick} />
          <AppImage src={googlePlay} alt='google-play' onClick={handleGoogleClick} />
          <AppImage src={oneStore} alt='one-store' onClick={handleOnestoreClick} />
        </ButtonsArea>
      </HeaderWrap>
      {contents.map((content: Omit<ContentPropsType, 'idx' | 'shadyBackground'>, idx: number) => (
        <Content
          {...content}
          idx={idx}
          shadyBackground={idx % 2 === 1}
          key={`content-${content.title}`}
        />
      ))}
      <BlankArea />
      <BrowserPageFooter />
    </>
  );
};

export default observer(BrowserPage);

const HeaderWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'device',
})<{ device: 'mobile' | 'tablet' | 'pc' }>(({ device }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: `calc(100% - ${device === 'mobile' ? 48 : 112}px)`,
  maxWidth: 656,
  height: device === 'mobile' ? 780 : 380,
  zIndex: 2,
}));

const CustomLogo = styled(Logo)({
  width: 48,
  height: 48,
  '& path': {
    fill: palette.white,
  },
  '& rect': {
    fill: palette.transparent,
  },
});

const HeaderText = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'device',
})<{ device: 'mobile' | 'tablet' | 'pc' }>(({ device }) => ({
  margin: `${device === 'mobile' ? 64 : 48}px 0 24px`,
  width: '100%',
  color: palette.white,
  fontSize: 32,
  fontWeight: 600,
  lineHeight: '40px',
  whiteSpace: 'pre-line',
  textAlign: 'center',
}));

const ButtonsArea = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
});

const AppImage = styled('img')({
  width: 327,
  height: 36,
  cursor: 'pointer',
});

const HeaderImage = styled('img', {
  shouldForwardProp: (prop: string) => prop !== 'device',
})<{ device: 'mobile' | 'tablet' | 'pc' }>(({ device }) => ({
  position: 'absolute',
  top: 0,
  width: '100%',
  minWidth: 376,
  height: device === 'mobile' ? 780 : 380,
  zIndex: 1,
}));

const BlankArea = styled('div')({
  width: '100%',
  height: 24,
  minHeight: 24,
});

const contents = [
  {
    headerLogo: locationIcon,
    title: '지도 · 장소 목록을 통한\r\n빠른 장소 탐색',
    content:
      '지도 · 장소 목록과 다양한 필터 기능을 통해\r\n원하는 장소의 인구 혼잡도를 쉽고 빠르게\r\n탐색할 수 있습니다.',
    contentImage: content1,
  },
  {
    headerLogo: personIcon,
    title: 'KT / SKT 위치 정보를 기반으로\r\n정확한 인구 혼잡도 파악',
    content:
      'KT / SKT에서 제공하는 위치 정보를 기반으로\r\n인구 혼잡도와 교통 현황, CCTV 정보를 제공합니다.',
    contentImage: content2,
  },
  {
    headerLogo: chatIcon,
    title: '실시간 리뷰를 통한\r\n장소 현황 및 정보 공유',
    content:
      '장소 별 실시간 리뷰를 공유하여\r\n추가적인 장소 정보나 실시간 인구 현황을\r\n더욱 생생하게 얻을 수 있습니다.',
    contentImage: content3,
    subContentImage: content3_1,
  },
];
