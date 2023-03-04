import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import SearchInput from './SearchInput';
import { useStore } from 'stores';
import { palette } from 'constants/';

const CustomDrawer = observer(() => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { ThemeStore, CustomDrawerStore } = useStore().MobxStore;
  const { search } = useLocation();
  const navigate = useNavigate();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleClose = () => {
    navigate(`/${CustomDrawerStore.variant}`);
    CustomDrawerStore.closeDrawer();
  };

  useEffect(() => {
    if (!drawerRef?.current?.childNodes) return;
    (drawerRef.current.childNodes[2] as HTMLDivElement).scrollTo(0, 0);
  }, [search]);

  return (
    <StyledDrawer
      isDarkTheme={isDarkTheme}
      search={search}
      ref={drawerRef}
      open={CustomDrawerStore.open}
      anchor='right'
      onClose={handleClose}
      transitionDuration={0}
    >
      {CustomDrawerStore.includesInputBox && <SearchInput />}
      {CustomDrawerStore.drawerComponent}
    </StyledDrawer>
  );
});

export default CustomDrawer;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'search'].includes(prop),
})<{ isDarkTheme: boolean; search: string }>(({ isDarkTheme, search }) => ({
  '& .MuiPaper-root': {
    color: isDarkTheme ? palette.white : palette.black,
    backgroundColor: isDarkTheme
      ? palette.grey[800]
      : search === ''
      ? palette.white
      : palette.grey[200],
    overflowX: 'hidden',
  },
}));
