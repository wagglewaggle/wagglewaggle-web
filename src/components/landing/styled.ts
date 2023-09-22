import { Button, styled } from '@mui/material';
import { palette } from 'constants/';
import { ReactComponent as Icon } from 'assets/icons/logo-icon.svg';
import type { ScreenType } from 'types/typeBundle';

export const Wrap = styled('div')({
  width: '100%',
  height: '100%',
  backgroundColor: palette.grey[700],
});

export const Logo = styled(Icon)({
  position: 'relative',
  top: '1rem',
  left: '2.5rem',
});

export const Title = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: `${screenType === 'pc' ? 16.438 : screenType === 'tablet' ? 19.5 : 7.188}rem`,
  marginBottom: `${screenType === 'pc' ? 2.5 : 2}rem`,
  fontSize: `${screenType !== 'pc' ? 2.5 : 4}rem`,
  fontWeight: 600,
  lineHeight: `${screenType !== 'pc' ? 3.375 : 5.2}rem`,
  textAlign: 'center',
  whiteSpace: 'pre',
}));

export const Description = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  margin: 'auto',
  maxWidth: screenType === 'mobile' ? '18.438rem' : 'unset',
  fontSize: '1.125rem',
  fontWeight: 500,
  lineHeight: '1.5rem',
  textAlign: 'center',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  '& strong': { fontWeight: 700 },
}));

export const CustomButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  display: 'flex',
  padding: '1.125rem 1.5rem',
  margin: `${screenType !== 'pc' ? 5.5 : 6}rem auto 3.375rem auto`,
  width: '12.75rem',
  color: palette.white,
  fontSize: '1.125rem',
  fontWeight: 700,
  lineHeight: '1.5rem',
  backgroundColor: palette.violet,
  gap: '0.375rem',
  '& span': { display: 'flex', alignItems: 'center', height: '1.5rem' },
  '&:hover': { backgroundColor: palette.violet },
}));
