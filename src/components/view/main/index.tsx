import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import lottie from 'lottie-web';
import MainLottie from 'assets/lottie/Main.json';
import { CustomDrawer } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import SuggestData from './SuggestData';
import ResultData from './ResultData';
import { Detail } from 'components/view';
import { useStore } from 'stores';
import { request } from 'api/request';
import { palette } from 'constants/';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';

const Main = observer(() => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<></>);
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [includeInput, setIncludeInput] = useState<boolean>(false);
  const lottieContainer = useRef<HTMLDivElement>(null);
  let timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { LocationStore, CustomDialogStore, ErrorStore, ThemeStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const handleWordClick = (searchWord: string) => {
    setSearchValue(searchWord);
    setCurrentPage(<ResultData searchWord={searchWord} />);
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
          searchValue={newValue}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
        />
      )
    );
  };

  const handleSearchClick = () => {
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
    setOpenDrawer(false);
    navigate('/');
    timeoutRef.current = setTimeout(() => {
      setSearchValue('');
      setCurrentPage(<></>);
      setIncludeInput(true);
    }, 300);
  };

  const navigateToHome = () => {
    onDrawerClose();
  };

  const initPlaceData = async () => {
    const params = { populationSort: true };
    const ktData = await request.getKtPlaces(params);
    const sktData = await request.getSktPlaces(params);
    if (!ktData || !sktData) return;
    LocationStore.setAllPlaces([...ktData.data.list, ...sktData.data.list]);
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
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const newDrawerState: boolean = location.search.length !== 0;
    if (!newDrawerState) {
      onDrawerClose();
      return;
    }
    setOpenDrawer(true);
    setIncludeInput(false);
    setCurrentPage(<Detail />);
    setSearchValue(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current ?? undefined);
  }, []);

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

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: MainLottie,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lottieContainer.current]);

  return (
    <SearchWrap>
      <SearchBox isDarkTheme={isDarkTheme}>
        <Logo onClick={navigateToHome} />
        <EmptySpace />
        <SearchIcon onClick={handleSearchClick} />
      </SearchBox>
      <PlaceData />
      <CustomDrawer
        searchValue={searchValue}
        handleSearchEnter={handleSearchEnter}
        onDrawerClose={onDrawerClose}
        handleSearchClick={handleSearchClick}
        handleSearchValueChange={handleSearchValueChange}
        open={openDrawer}
        onClose={onDrawerClose}
        includeInput={includeInput}
        component={currentPage}
      />
      <Lottie ref={lottieContainer} />
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

const Lottie = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  zIndex: -1,
  overflow: 'hidden',
});
