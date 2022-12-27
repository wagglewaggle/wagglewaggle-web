import { IconButton } from '@mui/material';
import { palette } from 'constants/';
import { ReactComponent as DeleteIcon } from 'assets/icons/delete-icon.svg';

interface propsType {
  handleIconClick: () => void;
}

const CustomCloseIcon = (props: propsType) => {
  const { handleIconClick } = props;

  return (
    <IconButton
      sx={{
        padding: 0,
        width: '20px',
        height: '20px',
        backgroundColor: palette.grey[600],
        '& path': {
          width: '16.67px',
          height: '16.67px',
        },
      }}
      disableRipple
      onClick={handleIconClick}
    >
      <DeleteIcon />
    </IconButton>
  );
};

export default CustomCloseIcon;
