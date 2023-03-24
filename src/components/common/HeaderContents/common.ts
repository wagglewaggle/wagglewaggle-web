import { IconButton, styled } from '@mui/material';
import { palette } from 'constants/';

export const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'pinned',
})<{ pinned?: boolean }>(({ pinned }) => ({
  padding: 0,
  width: 24,
  height: 24,
  '& svg': {
    width: 24,
    height: 24,
  },
  '& path': {
    fill: pinned === true ? palette.violet : pinned === false ? palette.grey[400] : palette.black,
  },
}));
