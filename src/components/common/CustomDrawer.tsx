import { useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import SearchInput from './SearchInput';
import CustomResizer from './DrawerContents/CustomResizer';
import { useStore } from 'stores';
import { palette } from 'constants/';

const CustomDrawer = observer(() => {
  const { ThemeStore, CustomDialogStore, CustomDrawerStore, LocationStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const { locationData } = LocationStore;
  const { includesInputBox } = CustomDrawerStore;

  const setAccidentLists = useCallback(() => {
    if (locationData && locationData?.accidents?.length > 0) {
      CustomDialogStore.openAccidentDialog(locationData.accidents);
    }
  }, [CustomDialogStore, locationData]);

  useEffect(() => {
    setAccidentLists();
  }, [locationData, setAccidentLists]);

  return (
    <>
      {CustomDrawerStore.open && (
        <>
          {includesInputBox ? (
            <SearchWrap isDarkTheme={isDarkTheme}>
              <SearchInput />
              {CustomDrawerStore.drawerComponent}
            </SearchWrap>
          ) : (
            <CustomResizer />
          )}
        </>
      )}
    </>
  );
});

export default CustomDrawer;

const SearchWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100vh',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
  zIndex: 100,
}));
