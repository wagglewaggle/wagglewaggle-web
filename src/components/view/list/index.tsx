import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { SearchData, ResultData, CustomHeader, NavigationIcons } from 'components/common';
import PlaceData from './PlaceData';
import axiosRequest from 'api/axiosRequest';
import { PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';

const List = observer(() => {
  const { CustomDialogStore, CustomDrawerStore, LocationStore, ErrorStore, AuthStore } =
    useStore().MobxStore;
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const handleWordClick = (searchWord: string) => {
    CustomDrawerStore.setSearchValue(searchWord);
    CustomDrawerStore.openDrawer(
      'list',
      <ResultData placeData={LocationStore.placesData} searchWord={searchWord} />
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
    LocationStore.setPlacesData(JSON.parse(JSON.stringify(newPlaceData)));
  };

  const initPlaceData = useCallback(async () => {
    const params = { populationSort: true };
    const placeData: { data: { list: PlaceDataType[] } } | undefined = await axiosRequest(
      'get',
      'place',
      params
    );
    if (!placeData) return;
    LocationStore.setPlacesData([...placeData.data.list]);
    [...placeData.data.list].forEach((data: PlaceDataType) => {
      LocationStore.setCategories(data.name, data.categories);
    });
  }, [LocationStore]);

  useEffect(() => {
    document.body.setAttribute('style', `overflow-y:auto`);
  }, [pathname]);

  useEffect(() => {
    if (!AuthStore.authorized) return;
    initPlaceData();
  }, [AuthStore.authorized, initPlaceData]);

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
    if (!CustomDrawerStore.searchValue || !search) {
      CustomDrawerStore.setTitle('와글와글');
    }
  }, [CustomDrawerStore, search, pathname]);

  useEffect(() => {
    if (!ErrorStore.statusCode) return;
    navigate(ErrorStore.statusCode === 404 ? '/not-found' : '/error');
  }, [ErrorStore.statusCode, navigate]);

  useEffect(() => {
    const newDrawerState = search.length !== 0;
    if (!newDrawerState) return;
    CustomDrawerStore.openDrawer('map', <></>);
  }, [CustomDrawerStore, search]);

  return (
    <Wrap>
      <CustomHeader navigateToHome={navigateToHome} handleSearchClick={handleSearchClick} />
      <PlaceData
        placeData={LocationStore.placesData}
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
