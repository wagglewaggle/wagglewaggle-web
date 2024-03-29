import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import SearchInput from './SearchInput';
import { Drawer, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';

interface propsType {
  searchValue: string;
  handleSearchEnter: (searchWord: string) => void;
  onDrawerClose: () => void;
  handleSearchClick: () => void;
  handleSearchValueChange: (newValue: string) => void;
  open: boolean;
  includeInput: boolean;
  component: JSX.Element;
  onClose: () => void;
}

const CustomDrawer = observer((props: propsType) => {
  const {
    searchValue,
    handleSearchEnter,
    onDrawerClose,
    handleSearchClick,
    handleSearchValueChange,
    open,
    includeInput,
    component,
    onClose,
  } = props;
  const drawerRef = useRef<HTMLDivElement>(null);
  const { ThemeStore, LocationStore } = useStore().MobxStore;
  const location = useLocation();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  useEffect(() => {
    if (!drawerRef?.current?.childNodes) return;
    (drawerRef.current.childNodes[2] as HTMLDivElement).scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerRef?.current, location.search]);

  return (
    <CustomMuiDrawer
      isDarkTheme={isDarkTheme}
      searchText={location.search}
      ref={drawerRef}
      open={open}
      anchor='right'
      onClose={onClose}
    >
      {includeInput && (
        <SearchInput
          searchValue={searchValue}
          handleSearchEnter={handleSearchEnter}
          handleDrawerClose={
            searchValue.length === 0 || !LocationStore.suggestionExists
              ? onDrawerClose
              : handleSearchClick
          }
          handleSearchValueChange={handleSearchValueChange}
        />
      )}
      {component}
    </CustomMuiDrawer>
  );
});

export default CustomDrawer;

const CustomMuiDrawer = styled(Drawer, {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'searchText'].includes(prop),
})<{ isDarkTheme: boolean; searchText: string }>(({ isDarkTheme, searchText }) => ({
  '& .MuiPaper-root': {
    color: isDarkTheme ? palette.white : palette.black,
    backgroundColor: isDarkTheme
      ? palette.grey[800]
      : searchText === ''
      ? palette.white
      : palette.grey[200],
    overflowX: 'hidden',
  },
}));
