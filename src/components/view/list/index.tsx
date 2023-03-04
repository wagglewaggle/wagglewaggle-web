import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { CustomSearchBox, NavigationIcons } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import ResultData from './ResultData';
import { Detail } from 'components/view';
import { PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';

const List = observer(() => {
  const { LocationStore, CustomDialogStore, CustomDrawerStore, ErrorStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const location = useLocation();

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

  const initPlaceData = useCallback(async () => {
    const params = { populationSort: true };
    const ktData: { data: { list: PlaceDataType[] } } | undefined = await axiosRequest(
      'kt-place',
      params
    );
    const sktData: { data: { list: PlaceDataType[] } } | undefined = await axiosRequest(
      'skt-place',
      params
    );
    if (!ktData || !sktData) return;
    const statusArr: string[] = [
      'VERY_RELAXATION',
      'RELAXATION',
      'NORMAL',
      'CROWDED',
      'VERY_CROWDED',
    ];
    CustomDrawerStore.setPlaceData(
      [...ktData.data.list, ...sktData.data.list].sort(
        (prev: PlaceDataType, next: PlaceDataType) => {
          const prevLevel = statusArr.indexOf(prev.populations[0].level);
          const nextLevel = statusArr.indexOf(next.populations[0].level);
          if (prevLevel > nextLevel) return -1;
          else if (nextLevel > prevLevel) return 1;
          return 0;
        }
      )
    );
    [...ktData.data.list, ...sktData.data.list].forEach((data: PlaceDataType) => {
      LocationStore.setCategories(data.name, data.categories);
    });
  }, [CustomDrawerStore, LocationStore]);

  useEffect(() => {
    initPlaceData();
    const openIntroDialog: boolean =
      location.search === '' &&
      sessionStorage.getItem('@wagglewaggle_intro_popup_open') !== 'false';
    CustomDialogStore.setOpen(openIntroDialog);
  }, [CustomDialogStore, initPlaceData, location.search]);

  useEffect(() => {
    const newDrawerState = location.pathname === '/list';
    if (!newDrawerState) {
      CustomDrawerStore.setIncludesInput(location.pathname === '/list/search');
      return;
    }
    CustomDrawerStore.closeDrawer();
  }, [CustomDrawerStore, location.pathname]);

  useEffect(() => {
    const newDrawerState = location.search.length !== 0;
    if (newDrawerState) {
      CustomDrawerStore.openDrawer('list', <Detail />);
      return;
    }
    CustomDrawerStore.closeDrawer();
  }, [CustomDrawerStore, location.search]);

  useEffect(() => {
    if (!CustomDrawerStore.searchValue || !location.search) {
      CustomDrawerStore.setTitle('와글와글');
    }
  }, [CustomDrawerStore, location.search]);

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
