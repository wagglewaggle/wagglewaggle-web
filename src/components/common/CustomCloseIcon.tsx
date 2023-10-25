import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
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
    <CustomIconButton disableRipple onClick={handleIconClick}>
      {isDarkTheme ? <DarkDeleteIcon /> : <LightDeleteIcon />}
    </CustomIconButton>
  );
});

export default CustomCloseIcon;

const CustomIconButton = styled(IconButton)({
  padding: 0,
  width: '20px',
  height: '20px',
  '& path': {
    width: '16.67px',
    height: '16.67px',
  },
});
