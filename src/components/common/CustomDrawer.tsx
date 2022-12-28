import { Fragment, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';

interface propsType {
  open: boolean;
  searchInput?: JSX.Element;
  component: JSX.Element;
  onClose: () => void;
}

const CustomDrawer = observer((props: propsType) => {
  const { open, searchInput = <Fragment />, component, onClose } = props;
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
    <Drawer
      sx={{
        '& .MuiPaper-root': {
          color: isDarkTheme ? palette.white : palette.black,
          backgroundColor: palette.grey[isDarkTheme ? 800 : 200],
          overflowX: 'hidden',
        },
      }}
      ref={drawerRef}
      open={open}
      anchor='right'
      onClose={onClose}
      transitionDuration={0}
    >
      {searchInput}
      {component}
    </Drawer>
  );
});

export default CustomDrawer;
