import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material';
import { SearchData, ResultData, CustomHeader, NavigationIcons } from 'components/common';
import MapContent from './MapContent';
import { useStore } from 'stores';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { CustomDrawerStore, CustomDialogStore } = useStore().MobxStore;

  const handleWordClick = (searchWord: string) => {
    CustomDrawerStore.setSearchValue(searchWord);
    CustomDrawerStore.openDrawer(
      'map',
      <ResultData placeData={CustomDrawerStore.placeData} searchWord={searchWord} />
    );
  };

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const navigateToHome = () => {
    navigate('/map');
  };

  const handleSearchClick = () => {
    navigate('/map/search');
    CustomDrawerStore.openDrawer(
      'map',
      <SearchData
        initialBlockList={JSON.parse(
          localStorage.getItem('@wagglewaggle_recently_searched') ?? '[]'
        )}
        handleWordClick={handleWordClick}
        handleLatestListChange={handleLatestListChange}
      />
    );
  };

  useEffect(() => {
    document.body.setAttribute('style', `overflow-y:hidden`);
  }, [pathname]);

  useEffect(() => {
    CustomDialogStore.setOpen(sessionStorage.getItem('@wagglewaggle_intro_popup_open') !== 'false');
  }, [CustomDialogStore]);

  useEffect(() => {
    if (!CustomDrawerStore.searchValue || !search) {
      CustomDrawerStore.setTitle('와글와글');
    }
  }, [CustomDrawerStore, search, pathname]);

  useEffect(() => {
    const newDrawerState = pathname === '/map';
    if (!newDrawerState) {
      CustomDrawerStore.setIncludesInput(pathname === '/map/search');
      return;
    }
    CustomDrawerStore.closeDrawer();
  }, [CustomDrawerStore, pathname]);

  useEffect(() => {
    const newDrawerState = search.length !== 0;
    if (!newDrawerState) return;
    CustomDrawerStore.openDrawer('map', <></>);
  }, [CustomDrawerStore, search]);

  return (
    <>
      <CustomHeader navigateToHome={navigateToHome} handleSearchClick={handleSearchClick} />
      <Wrap>
        <MapContent />
        <NavigationIcons />
      </Wrap>
    </>
  );
};

export default Map;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  zIndex: 2,
  overflow: 'hidden',
});
