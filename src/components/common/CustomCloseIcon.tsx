import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { palette } from 'constants/';

interface propsType {
  handleIconClick: () => void;
}

const CustomCloseIcon = (props: propsType) => {
  const { handleIconClick } = props;

  return (
    <IconButton
      sx={{
        padding: 0,
        marginLeft: '5px',
        width: '16px',
        height: '16px',
        backgroundColor: palette.grey[600],
      }}
      disableRipple
      onClick={handleIconClick}
    >
      <CloseIcon
        sx={{
          width: '11px',
          height: '11px',
          color: palette.black,
        }}
      />
    </IconButton>
  );
};

export default CustomCloseIcon;
