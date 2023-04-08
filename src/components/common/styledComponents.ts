import { styled } from '@mui/material';
import { palette } from 'constants/';

export const LinkCopyPopup = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  position: 'fixed',
  bottom: 22,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
  padding: '12px 0',
  margin: '8px 0 0',
  width: 'calc(100% - 48px)',
  maxWidth: 382,
  lineHeight: '20px',
  fontSize: 14,
  fontWeight: 600,
  gap: 8,
  color: isDarkTheme ? palette.black : palette.white,
  backgroundColor: isDarkTheme ? palette.white : palette.black,
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
  zIndex: 1250,
}));
