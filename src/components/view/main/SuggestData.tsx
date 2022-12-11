import { Fragment, useState, useEffect, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import { PlaceCard, SearchBlock } from 'components/common';
import { placeDataType, searchWordList } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5px 0 35px',
    width: 400,
  },
  listWrap: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
    gap: 8,
    color: palette.white,
    cursor: 'pointer',
    '& svg': {
      width: 24,
      height: 24,
    },
  },
  list: {
    flexGrow: 1,
    height: 24,
    fontSize: 14,
    fontWeight: 400,
  },
  includedPart: {
    color: palette.orange,
  },
  divider: {
    border: 0,
    width: '100%',
    height: 8,
    backgroundColor: palette.black,
  },
  title: {
    margin: '32px 20px 0',
    color: palette.white,
    fontSize: 18,
    fontWeight: 600,
  },
  cardWrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '30px 24px 35px',
  },
  emptySuggestionWrap: {
    padding: '0 24px',
    color: palette.grey[400],
    fontSize: 14,
    fontWeight: 400,
  },
}));

interface propsType {
  placeData: placeDataType[];
  searchValue: string;
  latestSearchList: searchWordList[];
  popularSearchList: searchWordList[];
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: searchWordList[]) => void;
  handlePopularListChange: (newList: searchWordList[]) => void;
}

const SuggestData = (props: propsType) => {
  const {
    placeData,
    searchValue,
    latestSearchList,
    popularSearchList,
    handleWordClick,
    handleLatestListChange,
    handlePopularListChange,
  } = props;
  const [suggestionList, setSuggestionList] = useState<placeDataType[]>([]);
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

  const handleListClick = (searchWord: string) => {
    handleWordClick(searchWord);
  };

  const getSuggestionList = useCallback(() => {
    setSuggestionList(placeData.filter((data: placeDataType) => data.name.includes(searchValue)));
  }, [placeData, searchValue]);

  useEffect(() => {
    getSuggestionList();
  }, [searchValue, getSuggestionList]);

  return (
    <div className={classes.wrap}>
      {suggestionList.map((list: placeDataType, idx: number) => (
        <div
          key={`suggest-data-${idx}`}
          className={classes.listWrap}
          onClick={() => handleListClick(list.name)}
        >
          <SearchIcon />
          <span className={classes.list}>
            <span className={classes.includedPart}>{searchValue}</span>
            {list.name.replace(searchValue, '')}
          </span>
        </div>
      ))}
      {suggestionList.length > 0 ? (
        <Fragment>
          <hr className={classes.divider} />
          <span className={classes.title}>관련 장소 현황</span>
          <div className={classes.cardWrap}>
            {suggestionList.map((place: placeDataType, idx: number) => (
              <PlaceCard key={`place-card-${idx}`} place={place} />
            ))}
          </div>
        </Fragment>
      ) : (
        <div className={classes.emptySuggestionWrap}>
          <SearchBlock
            title='최근 검색어'
            blockList={[]}
            onClickRemoveAll={handleRemoveAllLatestList}
            onClickRemoveOne={handleRemoveLatestList}
            handleWordClick={handleWordClick}
          />
          <SearchBlock
            title='인기 검색어'
            blockList={popularSearchList}
            onClickRemoveAll={handleRemoveAllPopularList}
            handleWordClick={handleWordClick}
          />
        </div>
      )}
    </div>
  );
};

export default SuggestData;
