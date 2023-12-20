import { IconButton, styled } from '@mui/material';
import { palette } from 'constants/';

export const HeaderArea = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  width: 'calc(100% - 2rem)',
  height: '2rem',
  color: palette.white,
  fontSize: '1.125rem',
  fontWeight: 600,
  backgroundColor: palette.grey[700],
});

export const ContentArea = styled('img')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  padding: 0,
  filter: isDarkTheme ? 'none' : 'invert(1)',
  '& img': {
    width: '1.75rem',
    height: '1.75rem',
  },
}));

export const Dummy = styled('span')({
  width: '1.75rem',
  backgroundColor: 'transparent',
});

export const CctvWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '0.5rem',
  backgroundColor: palette.grey[700],
  '& iframe': { backgroundColor: palette.grey[500] },
});
