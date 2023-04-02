import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material';
import { SearchData, ResultData, CustomHeader, NavigationIcons } from 'components/common';
import MapContent from './MapContent';
import { useStore } from 'stores';
import { initPlaceData } from 'util/';

declare global {
  interface Window {
    kakao: any;
  }
}

const Map = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { CustomDrawerStore, LocationStore, AuthStore } = useStore().MobxStore;
  const { placesData } = LocationStore;

  const handleWordClick = useCallback(
    (searchWord: string) => {
      CustomDrawerStore.setSearchValue(searchWord);
      CustomDrawerStore.openDrawer(
        'map',
        <ResultData placeData={placesData} searchWord={searchWord} />
      );
    },
    [CustomDrawerStore, placesData]
  );

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const navigateToHome = () => {
    navigate('/map');
  };

  const handleSearchClick = () => {
    navigate('/map/search');
    CustomDrawerStore.setIncludesInput(true);
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
    if (placesData.length !== 0 || !AuthStore.authorized) return;
    initPlaceData();
  }, [placesData.length, AuthStore.authorized]);

  useEffect(() => {
    sessionStorage.setItem('@wagglewaggle_intro_popup_open', 'false');
  }, []);

  useEffect(() => {
    if (!CustomDrawerStore.searchValue || !search) {
      CustomDrawerStore.setTitle('와글와글');
    }
  }, [CustomDrawerStore, search, pathname]);

  useEffect(() => {
    if (pathname === '/map' && !search) return;
    if (search) {
      CustomDrawerStore.setDrawerStatus({ expanded: 'appeared' });
      CustomDrawerStore.openDrawer('map', <></>);
      return;
    }
    CustomDrawerStore.setIncludesInput(true);
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
  }, [CustomDrawerStore, pathname, search, handleWordClick]);

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
