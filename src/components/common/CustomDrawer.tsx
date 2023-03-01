import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';

interface propsType {
  open: boolean;
  searchInput?: JSX.Element;
  component: JSX.Element;
  onClose: () => void;
}

const CustomDrawer = observer((props: propsType) => {
  const { open, searchInput = <></>, component, onClose } = props;
  const drawerRef = useRef<HTMLDivElement>(null);
  const { ThemeStore } = useStore().MobxStore;
  const location = useLocation();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  useEffect(() => {
    if (!drawerRef?.current?.childNodes) return;
    (drawerRef.current.childNodes[2] as HTMLDivElement).scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerRef?.current, location.search]);

  return (
    <StyledDrawer
      isDarkTheme={isDarkTheme}
      search={location.search}
      ref={drawerRef}
      open={open}
      anchor='right'
      onClose={onClose}
      transitionDuration={0}
    >
      {searchInput}
      {component}
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
