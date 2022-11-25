import { useState, useEffect, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '5px 0 35px',
  },
  listWrap: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 5px',
    borderTop: '3px solid #d9d9d9',
    '& svg': {
      margin: '5px 15px',
      width: 29,
      height: 29,
      color: '#000',
    },
    '&:first-child': {
      border: 0,
    },
  },
  list: {
    flexGrow: 1,
    height: 24,
    fontSize: 16,
    fontWeight: 500,
  },
  divider: {
    border: 0,
    width: '100%',
    height: 8,
    backgroundColor: '#d9d9d9',
  },
  cardWrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '30px 20px 35px',
    gap: 10,
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
      <hr className={classes.divider} />
      <div className={classes.cardWrap}>
        {suggestionList.map((place: placeDataType, idx: number) => (
          <PlaceCard key={`place-card-${idx}`} place={place} />
        ))}
      </div>
    </div>
  );
};

export default SuggestData;
