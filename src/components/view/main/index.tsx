import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { SearchInput } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
import SuggestData from './SuggestData';
import ResultData from './ResultData';
import { placeDataType, pageType } from 'types/typeBundle';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  footer: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
  },
}));

const Main = () => {
  const [currentPage, setCurrentPage] = useState<pageType>('main');
  const [placeData, setPlaceData] = useState<placeDataType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCurrentPageChange = (newPage: pageType) => {
    setCurrentPage(newPage);
    if (newPage === 'result') {
      navigate(`/main?search=${searchValue}`);
    } else if (currentPage === 'result') {
      navigate('/main');
    }
  };

  const handleSearchValueChange = (newValue: string) => {
    setSearchValue(newValue);
    setCurrentPage(newValue.length === 0 ? 'search' : 'suggestion');
  };

  useEffect(() => {
    const dummyPlaceData: placeDataType[] = [
      { id: 0, name: 'test1', category: 'category1', status: '복잡' },
      { id: 1, name: 'test2', category: 'category2', status: '여유' },
    ];
    setPlaceData(dummyPlaceData);
  }, []);

  useEffect(() => {
    const query: string = location.search.replace('?', '');
    const queryList: string[] = query.split('&');
    const queryObject: { [key: string]: string } = {};
    queryList.forEach((list: string) => {
      const [key, value] = list.split('=');
      queryObject[key] = value;
    });
    if (queryObject?.search) {
      setCurrentPage('result');
      setSearchValue(queryObject.search);
    }
  }, [location.search]);

  return (
    <div className={classes.wrap}>
      <SearchInput
        currentPage={currentPage}
        searchValue={searchValue}
        handleSearchValueChange={handleSearchValueChange}
        handleCurrentPageChange={handleCurrentPageChange}
      />
      {currentPage === 'main' ? (
        <PlaceData placeData={placeData} />
      ) : currentPage === 'search' ? (
        <SearchData />
      ) : currentPage === 'suggestion' ? (
        <SuggestData placeData={placeData} searchValue={searchValue} />
      ) : (
        <ResultData placeData={placeData} searchValue={searchValue} />
      )}
    </div>
  );
};

export default Main;
