import { styled } from '@mui/material';
import { palette } from 'constants/';
import { ContentPropsType } from '.';

const Content = (props: ContentPropsType) => {
  const { idx, headerLogo, title, content, contentImage, shadyBackground } = props;

  return (
    <Wrap shady={shadyBackground}>
      <SubWrap>
        <ContentWrap>
          <HeaderLogo src={headerLogo} alt='header' />
          <ContentWrap>
            <TextTitle>{title}</TextTitle>
            <TextContent>{content}</TextContent>
          </ContentWrap>
        </ContentWrap>
        <ContentImage
          src={contentImage}
          alt='content'
          height={idx === 0 ? 427 : idx === 1 ? 437 : 478}
        />
      </SubWrap>
    </Wrap>
  );
};

export default Content;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'shady',
})<{ shady: boolean }>(({ shady }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '56px 0px 44px',
  width: '100%',
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
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const ContentWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const TextTitle = styled('div')({
  margin: '16px 0',
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  whiteSpace: 'pre-line',
  textAlign: 'center',
});

const TextContent = styled('div')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-line',
  textAlign: 'center',
});

const ContentImage = styled('img', {
  shouldForwardProp: (prop: string) => prop !== 'height',
})<{ height: number }>(({ height }) => ({
  marginTop: 32,
  width: 327,
  height,
  transform: 'translateZ(0)',
  imageRendering: '-webkit-optimize-contrast',
  backfaceVisibility: 'hidden',
}));
