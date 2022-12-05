import { Fragment, useState, useEffect, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/palette';

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
}));

interface propsType {
  placeData: placeDataType[];
  searchValue: string;
}

const SuggestData = (props: propsType) => {
  const { placeData, searchValue } = props;
  const [suggestionList, setSuggestionList] = useState<placeDataType[]>([]);
  const classes = useStyles();

  const getSuggestionList = useCallback(() => {
    setSuggestionList(placeData.filter((data: placeDataType) => data.name.includes(searchValue)));
  }, [placeData, searchValue]);

  useEffect(() => {
    getSuggestionList();
  }, [searchValue, getSuggestionList]);

  return (
    <div className={classes.wrap}>
      {suggestionList.map((list: placeDataType, idx: number) => (
        <div key={`suggest-data-${idx}`} className={classes.listWrap}>
          <SearchIcon />
          <span className={classes.list}>{list.name}</span>
        </div>
      ))}
      {suggestionList.length > 0 && (
        <Fragment>
          <hr className={classes.divider} />
          <span className={classes.title}>관련 장소 현황</span>
        </Fragment>
      )}
      <div className={classes.cardWrap}>
        {suggestionList.map((place: placeDataType, idx: number) => (
          <PlaceCard key={`place-card-${idx}`} place={place} />
        ))}
      </div>
    </div>
  );
};

export default SuggestData;
