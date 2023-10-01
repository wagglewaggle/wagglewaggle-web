import { Button, styled } from '@mui/material';
import { palette } from 'constants/';
import { ReactComponent as Icon } from 'assets/icons/logo-icon.svg';
import type { ScreenType } from 'types/typeBundle';

export const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
});

export const BackgroundImage = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'bgImage',
})<{ bgImage: string }>(({ bgImage }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  zIndex: 1,
}));

export const Lottie = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 2,
  overflow: 'hidden',
});

export const Logo = styled(Icon)({
  position: 'relative',
  top: '1rem',
  left: '2.5rem',
  zIndex: 2,
});

export const Title = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: `${screenType === 'pc' ? 17.438 : screenType === 'tablet' ? 19.5 : 7.188}rem`,
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
  maxWidth: screenType === 'mobile' ? '18.438rem' : 'unset',
  fontSize: screenType === 'pc' ? '1.5rem' : '1.125rem',
  fontWeight: 500,
  lineHeight: `${screenType === 'pc' ? 2 : 1.5}rem`,
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
  margin: `${screenType !== 'pc' ? 5.5 : 4}rem auto 0 auto`,
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
