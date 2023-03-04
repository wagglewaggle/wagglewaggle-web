import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { SearchData, ResultData, CustomSearchBox, NavigationIcons } from 'components/common';
import PlaceData from './PlaceData';
import { Detail } from 'components/view';
import { PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';

const List = observer(() => {
  const { CustomDialogStore, CustomDrawerStore, ErrorStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const handleWordClick = (searchWord: string) => {
    CustomDrawerStore.setSearchValue(searchWord);
    CustomDrawerStore.openDrawer(
      'list',
      <ResultData placeData={CustomDrawerStore.placeData} searchWord={searchWord} />
    );
  };

  const handleSearchClick = () => {
    navigate('/list/search');
    CustomDrawerStore.openDrawer(
      'list',
      <SearchData
        initialBlockList={JSON.parse(
          localStorage.getItem('@wagglewaggle_recently_searched') ?? '[]'
        )}
        handleWordClick={handleWordClick}
        handleLatestListChange={handleLatestListChange}
      />
    );
  };

  const onDrawerClose = () => {
    navigate('/list');
    CustomDrawerStore.closeDrawer();
  };

  const navigateToHome = () => {
    onDrawerClose();
  };

  const handlePlaceDataChange = (newPlaceData: PlaceDataType[]) => {
    CustomDrawerStore.setPlaceData(JSON.parse(JSON.stringify(newPlaceData)));
  };

  useEffect(() => {
    CustomDialogStore.setOpen(sessionStorage.getItem('@wagglewaggle_intro_popup_open') !== 'false');
  }, [CustomDialogStore]);

  useEffect(() => {
    const newDrawerState = pathname === '/list';
    if (!newDrawerState) {
      CustomDrawerStore.setIncludesInput(pathname === '/list/search');
      return;
    }
    CustomDrawerStore.closeDrawer();
  }, [CustomDrawerStore, pathname]);

  useEffect(() => {
    const newDrawerState = search.length !== 0;
    if (newDrawerState) {
      CustomDrawerStore.openDrawer('list', <Detail />);
      return;
    }
    CustomDrawerStore.closeDrawer();
  }, [CustomDrawerStore, search]);

  useEffect(() => {
    if (!CustomDrawerStore.searchValue || !search) {
      CustomDrawerStore.setTitle('와글와글');
    }
  }, [CustomDrawerStore, search, pathname]);

  useEffect(() => {
    if (!ErrorStore.statusCode) return;
    navigate(ErrorStore.statusCode === 404 ? '/not-found' : '/error');
  }, [ErrorStore.statusCode, navigate]);

  return (
    <Wrap>
      <CustomSearchBox navigateToHome={navigateToHome} handleSearchClick={handleSearchClick} />
      <PlaceData
        placeData={CustomDrawerStore.placeData}
        handlePlaceDataChange={handlePlaceDataChange}
      />
      <NavigationIcons />
    </Wrap>
  );
});

export default List;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  zIndex: 2,
});
