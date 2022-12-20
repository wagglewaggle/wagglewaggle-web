import { Fragment, useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import { PlaceCard, SearchBlock } from 'components/common';
import { useStore } from 'stores';
import { placeDataType } from 'types/typeBundle';
import { palette, locationNames } from 'constants/';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5px 0 35px',
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
    display: 'flex',
    alignItems: 'center',
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
  latestSearchList: string[];
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: string[]) => void;
}

const SuggestData = observer((props: propsType) => {
  const { placeData, searchValue, latestSearchList, handleWordClick, handleLatestListChange } =
    props;
  const [searchBlockList, setSearchBlockList] = useState<string[]>([]);
  const [suggestionList, setSuggestionList] = useState<placeDataType[]>([]);
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;
  const WRAP_BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth : 400,
  };

  const handleRemoveLatestList = (list: string) => {
    const newList: string[] = JSON.parse(JSON.stringify(searchBlockList));
    const selectedList: string | undefined = newList.find(
      (selectedWord: string) => list === selectedWord
    );
    if (!selectedList) return;
    const selectedIdx: number = newList.indexOf(selectedList);
    newList.splice(selectedIdx, 1);
    setSearchBlockList(newList);
    handleLatestListChange(newList);
  };

  const handleRemoveAllLatestList = () => {
    setSearchBlockList([]);
    handleLatestListChange([]);
  };

  const handleListClick = (searchWord: string) => {
    handleWordClick(searchWord);
  };

  const getSuggestionList = useCallback(() => {
    setSuggestionList(
      placeData.filter((data: placeDataType) =>
        (locationNames[data.name] || data.name).startsWith(searchValue)
      )
    );
  }, [placeData, searchValue]);

  useEffect(() => {
    setSearchBlockList([...latestSearchList]);
  }, [latestSearchList]);

  useEffect(() => {
    getSuggestionList();
  }, [searchValue, getSuggestionList]);

  return (
    <Box className={classes.wrap} sx={WRAP_BOX_STYLE}>
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
            blockList={searchBlockList}
            onClickRemoveAll={handleRemoveAllLatestList}
            onClickRemoveOne={handleRemoveLatestList}
            handleWordClick={handleWordClick}
          />
        </div>
      )}
    </Box>
  );
});

export default SuggestData;
