import { Fragment, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { CustomDrawer, SearchInput } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import SuggestData from './SuggestData';
import ResultData from './ResultData';
import { Detail } from 'components/view';
import { placeDataType, searchWordList } from 'types/typeBundle';
import { useStore } from 'stores';
import logo from 'assets/temp-logo.png';
import searchIcon from 'assets/icons/search-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    height: 56,
  },
  searchBox: {
    flexGrow: 1,
    height: '100%',
    cursor: 'pointer',
  },
}));

const Main = () => {
  const [currentPage, setCurrentPage] = useState<JSX.Element>(<Fragment />);
  const [placeData, setPlaceData] = useState<placeDataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [latestList, setLatestList] = useState<searchWordList[]>([]);
  const [popularList, setPopularList] = useState<searchWordList[]>([]);
  const [includeInput, setIncludeInput] = useState<boolean>(false);
  const classes = useStyles();
  const { CustomDialogStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const location = useLocation();
  const LATEST_SEARCH_LIST: searchWordList[] = useMemo(
    () => [
      { id: 0, word: '어나더오피스 패딩' },
      { id: 1, word: '갈색 가디건' },
      { id: 2, word: '단추' },
      { id: 3, word: '진주 귀걸이' },
      { id: 4, word: '진주 미니 귀걸이' },
    ],
    []
  );
  const POPULAR_SEARCH_LIST: searchWordList[] = useMemo(
    () => [
      { id: 0, word: '니트' },
      { id: 1, word: '패딩' },
      { id: 2, word: '맨투맨' },
      { id: 3, word: '머플러' },
      { id: 4, word: '장갑' },
      { id: 5, word: '시엔느' },
      { id: 6, word: '어그' },
      { id: 7, word: '프라이탁' },
      { id: 8, word: '무스탕' },
    ],
    []
  );

  const handleLatestListChange = (newList: searchWordList[]) => {
    setLatestList(newList);
  };

  const handlePopularListChange = (newList: searchWordList[]) => {
    setPopularList(newList);
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
          latestSearchList={latestList}
          popularSearchList={popularList}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
          handlePopularListChange={handlePopularListChange}
        />
      ) : (
        <SuggestData
          placeData={placeData}
          searchValue={newValue}
          latestSearchList={latestList}
          popularSearchList={popularList}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
          handlePopularListChange={handlePopularListChange}
        />
      )
    );
  };

  const handleSearchClick = () => {
    setOpenDrawer(true);
    setCurrentPage(
      <SearchData
        latestSearchList={latestList}
        popularSearchList={popularList}
        handleWordClick={handleWordClick}
        handleLatestListChange={handleLatestListChange}
        handlePopularListChange={handlePopularListChange}
      />
    );
  };

  const onDrawerClose = () => {
    navigate('/main');
    setOpenDrawer(false);
    setSearchValue('');
    setCurrentPage(<Fragment />);
  };

  useEffect(() => {
    const dummyPlaceData: placeDataType[] = [
      { id: 0, name: 'test1', category: '테마파크', status: 'CROWDED' },
      { id: 1, name: 'test2', category: '쇼핑몰', status: 'RELAXATION' },
    ];
    setPlaceData(dummyPlaceData);
    CustomDialogStore.setOpen(location.search === '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newDrawerState: boolean = location.search.length !== 0;
    setOpenDrawer(newDrawerState);
    setIncludeInput(!newDrawerState);
    setCurrentPage(newDrawerState ? <Detail /> : <Fragment />);
    setSearchValue(newDrawerState ? searchValue : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    setLatestList([...LATEST_SEARCH_LIST]);
    setPopularList([...POPULAR_SEARCH_LIST]);
  }, [LATEST_SEARCH_LIST, POPULAR_SEARCH_LIST]);

  return (
    <div className={classes.wrap}>
      <div className={classes.search}>
        <img src={logo} alt='logo' />
        <div className={classes.searchBox} onClick={handleSearchClick} />
        <img src={searchIcon} alt='search' />
      </div>
      <PlaceData placeData={placeData} />
      <CustomDrawer
        open={openDrawer}
        onClose={onDrawerClose}
        searchInput={
          includeInput ? (
            <SearchInput
              searchValue={searchValue}
              handleSearchEnter={handleSearchEnter}
              handleDrawerClose={onDrawerClose}
              handleSearchValueChange={handleSearchValueChange}
            />
          ) : undefined
        }
        component={currentPage}
      />
    </div>
  );
};

export default Main;
