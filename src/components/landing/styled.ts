import { Button, styled } from '@mui/material';
import { palette } from 'constants/';
import { ReactComponent as Icon } from 'assets/icons/logo-icon.svg';
import type { ScreenType } from 'types/typeBundle';

export const Wrap = styled('div')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'calc(100vh + 8rem)',
  overflow: 'hidden',
});

export const BackgroundWrap = styled('div')({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '-200%',
  right: '-200%',
  textAlign: 'center',
  overflow: 'hidden',
});

export const BackgroundImage = styled('img', {
  shouldForwardProp: (prop: string) => prop !== 'screenWidth',
})<{ screenWidth: number }>(({ screenWidth }) => ({
  width: screenWidth > 1580 ? '100vw' : 'auto',
  height: '100vh',
  overflow: 'hidden',
}));

export const Lottie = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 2,
  overflow: 'hidden',
  transform: `translateY(${screenType === 'pc' ? 0 : -11.5}rem)`,
}));

export const Logo = styled(Icon)({
  position: 'absolute',
  top: '1rem',
  left: '1.5rem',
  zIndex: 2,
});

export const Content = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
});

export const Title = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: `${screenType === 'pc' ? 2.5 : 2}rem`,
  fontSize: `${screenType !== 'pc' ? 2.5 : 4}rem`,
  fontWeight: 600,
  lineHeight: `${screenType !== 'pc' ? 3.375 : 5.2}rem`,
  textAlign: 'center',
  whiteSpace: 'pre',
  zIndex: 2,
}));

export const Description = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  margin: '0 auto',
  maxWidth: screenType === 'mobile' ? '19rem' : 'unset',
  fontSize: screenType === 'pc' ? '1.25rem' : '1.125rem',
  fontWeight: 500,
  lineHeight: `${screenType === 'pc' ? 1.75 : 1.5}rem`,
  textAlign: 'center',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  zIndex: 2,
  '& strong': { fontWeight: 700 },
}));

export const CustomButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  display: 'flex',
  padding: '1.125rem 1.5rem',
  margin: `${screenType !== 'pc' ? 3 : 4}rem auto 0 auto`,
  width: '12.75rem',
  color: palette.white,
  fontSize: '1.125rem',
  fontWeight: 700,
  lineHeight: '1.5rem',
  backgroundColor: palette.violet,
  gap: '0.375rem',
  zIndex: 2,
  '& span': { display: 'flex', alignItems: 'center', height: '1.5rem' },
  '&:hover': { backgroundColor: palette.violet },
}));
