import { styled } from '@mui/material';
import { observer } from 'mobx-react';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ContentPropsType } from '.';

const Content = (props: ContentPropsType) => {
  const { headerLogo, title, content, contentImage, subContentImage, shadyBackground } = props;
  const { ScreenSizeStore } = useStore().MobxStore;
  const { screenWidth } = ScreenSizeStore;
  const device = screenWidth < 768 ? 'mobile' : screenWidth < 1024 ? 'tablet' : 'pc';

  return (
    <Wrap shady={shadyBackground} device={device}>
      <SubWrap>
        <HeaderLogo src={headerLogo} alt='header' />
        <TextWrap>
          <TextTitle>{title}</TextTitle>
          <TextContent>{content}</TextContent>
        </TextWrap>
        {device !== 'mobile' && subContentImage && (
          <SubContentImage src={subContentImage} alt='sub-content' />
        )}
      </SubWrap>
      <ContentImage src={contentImage} alt='content' device={device} />
    </Wrap>
  );
};

export default observer(Content);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => !['shady', 'device'].includes(prop),
})<{ shady: boolean; device: 'mobile' | 'tablet' | 'pc' }>(({ shady, device }) => ({
  display: 'flex',
  flexDirection: device === 'mobile' ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: device === 'mobile' ? 'center' : 'flex-start',
  padding: `56px ${device === 'mobile' ? 24 : 56}px 44px`,
  width: `calc(100% - ${device === 'mobile' ? 48 : 112}px)`,
  maxWidth: 768,
  backgroundColor: shady ? palette.grey[100] : palette.white,
  zIndex: 0,
}));

const HeaderLogo = styled('img')({
  width: 48,
  height: 48,
});

const SubWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const TextWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const TextTitle = styled('div')({
  margin: '16px 0',
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  whiteSpace: 'pre-line',
});

const TextContent = styled('div')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-line',
});

const ContentImage = styled('img', {
  shouldForwardProp: (prop: string) => prop !== 'device',
})<{ device: 'mobile' | 'tablet' | 'pc' }>(({ device }) => ({
  marginTop: device === 'mobile' ? 32 : 120,
  width: 327,
  height: 427,
}));

const SubContentImage = styled('img')({
  width: 96,
  height: 111,
});
