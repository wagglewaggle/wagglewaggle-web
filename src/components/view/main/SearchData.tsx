import { useState, useEffect, useMemo } from 'react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { searchWordList } from 'types/typeBundle';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5px 20px 35px',
  },
  subComponent: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
  },
  list: {
    flexGrow: 1,
    padding: '5px 0',
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    border: 0,
    padding: 0,
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
  },
  listWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

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

  const handleClickRemoveAll = () => {
    setSearchList([]);
  };

  const handleClickRemove = (listId: number) => {
    const selectedList: searchWordList | undefined = searchList.find(
      (list: searchWordList) => list.id === listId
    );
    if (!selectedList) return;
    const selectedIdx: number = searchList.indexOf(selectedList);
    const newSearchList: searchWordList[] = JSON.parse(JSON.stringify(searchList));
    newSearchList.splice(selectedIdx, 1);
    setSearchList(newSearchList);
  };

  useEffect(() => {
    setSearchList([...LATEST_SEARCH_LIST]);
    setPopularList([...POPULAR_SEARCH_LIST]);
  }, [LATEST_SEARCH_LIST, POPULAR_SEARCH_LIST]);

  return (
    <div className={classes.wrap}>
      <div className={classes.subComponent}>
        <div className={classes.header}>
          <span className={classes.title}>최근검색어</span>
          <button className={classes.removeButton} onClick={handleClickRemoveAll}>
            모두 지우기
          </button>
        </div>
        {searchList.map((list: searchWordList, idx: number) => (
          <div key={`search-list-${idx}`} className={classes.listWrap}>
            <div className={classes.list}>{list.word}</div>
            <IconButton
              sx={{
                marginLeft: '5px',
                width: '16px',
                height: '16px',
                backgroundColor: '#d9d9d9',
              }}
              onClick={() => handleClickRemove(list.id)}
            >
              <CloseIcon
                sx={{
                  width: '11px',
                  height: '11px',
                  color: 'rgba(0, 0, 0, 0.4)',
                }}
              />
            </IconButton>
          </div>
        ))}
      </div>
      <div className={classes.subComponent}>
        <div className={classes.header}>
          <span className={classes.title}>인기검색어</span>
        </div>
        {popularList.map((list: searchWordList, idx: number) => (
          <div key={`popular-list-${idx}`} className={classes.list}>
            {list.word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchData;
