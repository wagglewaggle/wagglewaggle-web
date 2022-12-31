import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { useStore } from 'stores';
import { ReactComponent as DarkDeleteIcon } from 'assets/icons/delete-dark-icon.svg';
import { ReactComponent as LightDeleteIcon } from 'assets/icons/delete-light-icon.svg';

interface propsType {
  handleIconClick: () => void;
}

const CustomCloseIcon = observer((props: propsType) => {
  const { handleIconClick } = props;
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  return (
    <IconButton
      sx={{
        padding: 0,
        width: '20px',
        height: '20px',
        '& path': {
          width: '16.67px',
          height: '16.67px',
        },
      }}
      disableRipple
      onClick={handleIconClick}
    >
      {isDarkTheme ? <DarkDeleteIcon /> : <LightDeleteIcon />}
    </IconButton>
  );
});

export default CustomCloseIcon;
