import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material';
import {
  SearchData,
  ResultData,
  CustomSearchBox,
  CustomChips,
  NavigationIcons,
} from 'components/common';
import Detail from 'components/view/detail';
import MapContent from './MapContent';
import { useStore } from 'stores';

const Map = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
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

  const handleClickChip = (chip: string) => {
    setSelectedCategory(chip);
  };

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
    if (newDrawerState) {
      CustomDrawerStore.openDrawer('map', <Detail />);
      return;
    }
    CustomDrawerStore.closeDrawer();
  }, [CustomDrawerStore, search]);

  return (
    <Wrap>
      <CustomSearchBox navigateToHome={navigateToHome} handleSearchClick={handleSearchClick} />
      <ChipsWrap>
        <CustomChips selectedCategory={selectedCategory} handleClickChip={handleClickChip} />
      </ChipsWrap>
      <MapContent />
      <NavigationIcons />
    </Wrap>
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

const ChipsWrap = styled('div')({
  padding: '0 24px',
  width: 'calc(100% - 40px)',
  transform: 'translateX(-4px)',
});
