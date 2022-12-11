import makeStyles from '@mui/styles/makeStyles';
import { SearchBlock } from 'components/common';
import { searchWordList } from 'types/typeBundle';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 24px 35px',
    width: 352,
  },
}));

interface propsType {
  latestSearchList: searchWordList[];
  popularSearchList: searchWordList[];
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: searchWordList[]) => void;
  handlePopularListChange: (newList: searchWordList[]) => void;
}

const SearchData = (props: propsType) => {
  const {
    latestSearchList,
    popularSearchList,
    handleWordClick,
    handleLatestListChange,
    handlePopularListChange,
  } = props;
  const classes = useStyles();

  const handleRemoveLatestList = (listId: number) => {
    const newList: searchWordList[] = JSON.parse(JSON.stringify(latestSearchList));
    const selectedList: searchWordList | undefined = newList.find(
      (list: searchWordList) => list.id === listId
    );
    if (!selectedList) return;
    const selectedIdx: number = newList.indexOf(selectedList);
    newList.splice(selectedIdx, 1);
    handleLatestListChange(newList);
  };

  const handleRemoveAllLatestList = () => {
    handleLatestListChange([]);
  };

  const handleRemoveAllPopularList = () => {
    handlePopularListChange([]);
  };

  return (
    <div className={classes.wrap}>
      <SearchBlock
        title='최근 검색어'
        blockList={latestSearchList}
        onClickRemoveOne={handleRemoveLatestList}
        onClickRemoveAll={handleRemoveAllLatestList}
        handleWordClick={handleWordClick}
      />
      <SearchBlock
        title='인기 검색어'
        blockList={popularSearchList}
        onClickRemoveAll={handleRemoveAllPopularList}
        handleWordClick={handleWordClick}
      />
    </div>
  );
};

export default SearchData;
