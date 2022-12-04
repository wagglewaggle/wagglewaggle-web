import { useState, useEffect, useMemo } from 'react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { searchWordList } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5px 20px 35px',
  },
  subComponent: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
  },
  title: {
    color: palette.white,
    fontSize: 14,
    fontWeight: 700,
  },
  listWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    padding: '5px 0',
    color: palette.white,
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    border: 0,
    padding: 0,
    backgroundColor: palette.transparent,
    color: palette.white,
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
  },
}));

interface blockPropsType {
  title: string;
  blockList: searchWordList[];
  onClickRemoveAll: () => void;
  onClickRemoveOne: (listId: number, type: 'search' | 'popular') => void;
}

const SearchBlock = (props: blockPropsType) => {
  const { title, blockList, onClickRemoveAll, onClickRemoveOne } = props;
  const classes = useStyles();
  const BLOCK_TYPE: 'search' | 'popular' = title === '최근검색어' ? 'search' : 'popular';

  return (
    <div className={classes.subComponent}>
      <div className={classes.header}>
        <span className={classes.title}>{title}</span>
        <button className={classes.removeButton} onClick={onClickRemoveAll}>
          모두 지우기
        </button>
      </div>
      {blockList.map((list: searchWordList, idx: number) => (
        <div key={`search-list-${idx}`} className={classes.listWrap}>
          <div className={classes.list}>{list.word}</div>
          <IconButton
            sx={{
              marginLeft: '5px',
              width: '16px',
              height: '16px',
              backgroundColor: palette.grey[600],
            }}
            onClick={() => onClickRemoveOne(list.id, BLOCK_TYPE)}
          >
            <CloseIcon
              sx={{
                width: '11px',
                height: '11px',
                color: palette.black,
              }}
            />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

const SearchData = () => {
  const [searchList, setSearchList] = useState<searchWordList[]>([]);
  const [popularList, setPopularList] = useState<searchWordList[]>([]);
  const classes = useStyles();
  const LATEST_SEARCH_LIST: searchWordList[] = useMemo(
    () => [
      { id: 0, word: '어나더오피스 패딩어나더오피스 패딩어나더오피스 패딩어나더오피스 패딩' },
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

  const handleRemoveAllSearchList = () => {
    setSearchList([]);
  };

  const handleRemoveAllPopularList = () => {
    setPopularList([]);
  };

  const handleRemoveList = (listId: number, type: 'search' | 'popular') => {
    const newList: searchWordList[] = JSON.parse(
      JSON.stringify(type === 'search' ? searchList : popularList)
    );
    const selectedList: searchWordList | undefined = newList.find(
      (list: searchWordList) => list.id === listId
    );
    if (!selectedList) return;
    const selectedIdx: number = newList.indexOf(selectedList);
    newList.splice(selectedIdx, 1);
    type === 'search' ? setSearchList(newList) : setPopularList(newList);
  };

  useEffect(() => {
    setSearchList([...LATEST_SEARCH_LIST]);
    setPopularList([...POPULAR_SEARCH_LIST]);
  }, [LATEST_SEARCH_LIST, POPULAR_SEARCH_LIST]);

  return (
    <div className={classes.wrap}>
      <SearchBlock
        title='최근검색어'
        blockList={searchList}
        onClickRemoveOne={handleRemoveList}
        onClickRemoveAll={handleRemoveAllSearchList}
      />
      <SearchBlock
        title='인기검색어'
        blockList={popularList}
        onClickRemoveOne={handleRemoveList}
        onClickRemoveAll={handleRemoveAllPopularList}
      />
    </div>
  );
};

export default SearchData;
