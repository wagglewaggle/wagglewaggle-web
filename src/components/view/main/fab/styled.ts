import { Fab, Tooltip, styled } from '@mui/material';
import { palette } from 'constants/';
import { ReactComponent as Close } from 'assets/icons/close-icon.svg';
import { ReactComponent as Chat } from 'assets/icons/chat-icon.svg';

export const FabTooltip = styled(Tooltip)({});

export const FloatingButton = styled(Fab)({
  position: 'fixed',
  right: '1.5rem',
  bottom: '3.5rem',
  width: '3rem',
  height: '3rem',
  backgroundColor: palette.violet,
  '&:hover': { backgroundColor: palette.violet },
});

export const TooltipText = styled('span')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: palette.black,
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.25rem',
  whiteSpace: 'break-spaces',
});

export const EmphTooltipText = styled('span')({
  color: palette.violet,
});

export const CloseIcon = styled(Close)({
  marginLeft: '0.25rem',
  width: '1rem',
  height: '1rem',
  cursor: 'pointer',
  '& path': { fill: palette.grey[400] },
});

export const ChatIcon = styled(Chat)({});
