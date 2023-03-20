import { styled } from '@mui/material';
import { palette } from 'constants/';

export const LinkCopyPopup = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
  padding: '12px 0',
  margin: '8px 0 0',
  width: '100%',
  maxWidth: 400,
  lineHeight: '20px',
  fontSize: 14,
  fontWeight: 600,
  gap: 8,
  color: isDarkTheme ? palette.black : palette.white,
  backgroundColor: isDarkTheme ? palette.white : palette.black,
}));
