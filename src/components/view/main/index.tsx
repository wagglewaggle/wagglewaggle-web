import { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { CustomDrawer, SearchInput } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import SuggestData from './SuggestData';
import ResultData from './ResultData';
import { Detail } from 'components/view';
import { PlaceDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { palette } from 'constants/';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';

const Main = observer(() => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<Fragment />);
  const [placeData, setPlaceData] = useState<PlaceDataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [includeInput, setIncludeInput] = useState<boolean>(false);
  const { LocationStore, CustomDialogStore, ErrorStore, ThemeStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const handleWordClick = (searchWord: string) => {
    setSearchValue(searchWord);
    setCurrentPage(<ResultData placeData={placeData} searchWord={searchWord} />);
  };

  const handleSearchEnter = (searchWord: string) => {
    handleWordClick(searchWord);
  };

  const handleSearchValueChange = (newValue: string) => {
    setSearchValue(newValue);
    setCurrentPage(
      newValue.length === 0 ? (
        <SearchData
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
          handleSearchValueChange={handleSearchValueChange}
        />
      ) : (
        <SuggestData
          placeData={placeData}
          searchValue={newValue}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
        />
      )
    );
  };

  const handleSearchClick = () => {
    navigate('/main/search');
    setOpenDrawer(true);
    setCurrentPage(
      <SearchData
        handleWordClick={handleWordClick}
        handleLatestListChange={handleLatestListChange}
        handleSearchValueChange={handleSearchValueChange}
      />
    );
  };

  const onDrawerClose = () => {
    navigate('/main');
    setOpenDrawer(false);
    setSearchValue('');
    setCurrentPage(<></>);
  };

  const navigateToHome = () => {
    onDrawerClose();
  };

  const handlePlaceDataChange = (newPlaceData: PlaceDataType[]) => {
    setPlaceData(JSON.parse(JSON.stringify(newPlaceData)));
  };

  const initPlaceData = async () => {
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
    setPlaceData(
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
  };

  useEffect(() => {
    initPlaceData();
    const openIntroDialog: boolean =
      location.search === '' &&
      sessionStorage.getItem('@wagglewaggle_intro_popup_open') !== 'false';
    CustomDialogStore.setOpen(openIntroDialog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newDrawerState = location.pathname === '/main';
    if (!newDrawerState) {
      setIncludeInput(location.pathname === '/main/search');
      return;
    }
    setOpenDrawer(false);
  }, [location.pathname]);

  useEffect(() => {
    const newDrawerState = location.search.length !== 0;
    setOpenDrawer(newDrawerState);
    setCurrentPage(newDrawerState ? <Detail /> : <></>);
    setSearchValue(newDrawerState ? searchValue : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    if (searchValue.length === 0 || location.search.length === 0) {
      const htmlTitle = document.querySelector('title');
      if (!htmlTitle) return;
      htmlTitle.innerHTML = '와글와글';
    }
  }, [searchValue, location.search]);

  useEffect(() => {
    if (!ErrorStore.statusCode) return;
    navigate(ErrorStore.statusCode === 404 ? '/not-found' : '/error');
  }, [ErrorStore.statusCode, navigate]);

  return (
    <SearchWrap>
      <SearchBox isDarkTheme={isDarkTheme}>
        <Logo onClick={navigateToHome} />
        <EmptySpace />
        <SearchIcon onClick={handleSearchClick} />
      </SearchBox>
      <PlaceData placeData={placeData} handlePlaceDataChange={handlePlaceDataChange} />
      <CustomDrawer
        open={openDrawer}
        onClose={onDrawerClose}
        searchInput={
          includeInput ? (
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
          ) : undefined
        }
        component={currentPage}
      />
    </SearchWrap>
  );
});

export default Main;

const SearchWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  zIndex: 2,
});

const SearchBox = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: 56,
  '& svg': {
    width: 40,
    height: 40,
    cursor: 'pointer',
  },
  '& svg:last-of-type': {
    width: 32,
    height: 32,
  },
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
}));

const EmptySpace = styled('div')({
  flexGrow: 1,
  height: '100%',
});
