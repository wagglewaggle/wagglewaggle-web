import { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Block, SearchInput } from 'components/common';
import PlaceData from './PlaceData';
import SearchData from './SearchData';
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
  const classes = useStyles();

  const handleCurrentPageChange = (newPage: pageType) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const dummyPlaceData: placeDataType[] = [
      { name: 'test1', category: 'category1', status: '복잡' },
      { name: 'test2', category: 'category2', status: '여유' },
    ];
    setPlaceData(dummyPlaceData);
  }, []);

  return (
    <div className={classes.wrap}>
      <Block />
      <SearchInput currentPage={currentPage} handleCurrentPageChange={handleCurrentPageChange} />
      {currentPage === 'main' ? <PlaceData placeData={placeData} /> : <SearchData />}
      <footer className={classes.footer}>
        <Block blockHeight='28px' blockColor='#79afff' />
      </footer>
    </div>
  );
};

export default Main;
