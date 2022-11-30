import { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Block, SearchInput } from 'components/common';
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

  const handleCurrentPageChange = (newPage: pageType) => {
    setCurrentPage(newPage);
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

  return (
    <div className={classes.wrap}>
      <Block />
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
      <footer className={classes.footer}>
        <Block blockHeight='28px' blockColor='#79afff' />
      </footer>
    </div>
  );
};

export default Main;
