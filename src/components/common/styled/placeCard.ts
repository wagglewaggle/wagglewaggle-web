import { styled } from '@mui/material';
import { palette } from 'constants/';
import { ReactComponent as RaIcon } from 'assets/icons/right-icon.svg';

export const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: 4,
  padding: '14px 16px',
  marginBottom: 8,
  width: 'calc(100% - 32px)',
  height: 'fit-content',
  backgroundColor: palette.grey[isDarkTheme ? 600 : 100],
  cursor: 'pointer',
}));

export const PlaceLeft = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
});

export const PlaceImage = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& img': {
    width: 40,
    height: 40,
  },
});

export const PlaceTitle = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: 8,
  lineHeight: '20px',
});

export const PlaceName = styled('span')({
  fontSize: 14,
  fontWeight: 600,
});

export const PlaceCategory = styled('span')({
  color: palette.grey[400],
  fontSize: 14,
  fontWeight: 400,
});

export const StatusWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  fontWeight: 600,
});

export const RightArrow = styled(RaIcon)({
  marginLeft: '0.25rem',
  '& path': { fill: palette.grey[500] },
});
