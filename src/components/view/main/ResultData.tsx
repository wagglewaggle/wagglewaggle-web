import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/palette';
import emptyImage from 'assets/error-image.png';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '5px 20px 35px',
    color: palette.white,
  },
  emptyImg: {
    margin: '40px 0 24px',
    width: 120,
    height: 120,
  },
  emptyComment: {
    fontSize: 18,
    fontWeight: 600,
  },
  emptySuggestion: {
    margin: '8px 0 64px',
    color: palette.grey[400],
    fontSize: 14,
    fontWeight: 400,
  },
  emptyTitle: {
    marginTop: 32,
    width: '100%',
    fontSize: 18,
    fontWeight: 600,
  },
  listWrap: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 10,
  },
  subComponent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    display: 'flex',
    padding: '15px 0 5px',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  dataLength: {
    marginLeft: 5,
    fontWeight: 700,
  },
}));

interface propsType {
  placeData: placeDataType[];
  searchWord: string;
}

const ResultData = (props: propsType) => {
  const { placeData, searchWord } = props;
  const [resultData, setResultData] = useState<placeDataType[]>([]);
  const [relatedData, setRelatedData] = useState<placeDataType[]>([]);
  const [suggestedData, setSuggestedData] = useState<placeDataType[]>([]);
  const classes = useStyles();
  const DUMMY_RELATED_DATA: placeDataType[] = useMemo(
    () => [
      { id: 2, name: 'test7', category: 'category7', status: 'crowded' },
      { id: 3, name: 'test8', category: 'category8', status: 'very crowded' },
      { id: 4, name: 'test9', category: 'category9', status: 'normal' },
      { id: 5, name: 'test10', category: 'category10', status: 'very uncrowded' },
    ],
    []
  );
  const DUMMY_SUGGESTED_DATA: placeDataType[] = useMemo(
    () => [
      { id: 6, name: '여의나루역', category: 'category7', status: 'crowded' },
      { id: 7, name: 'IFC몰', category: 'category8', status: 'uncrowded' },
    ],
    []
  );
  const EMPTY_DATA_COMMENT: string = `검색 결과가 없어요 ;(
    대신 최근에 사람들이 많이 찾아본 여기는 어떠세요?`;

  const getSuggestionList = useCallback(() => {
    setResultData(placeData.filter((data: placeDataType) => data.name.includes(searchWord)));
  }, [placeData, searchWord]);

  useEffect(() => {
    setSuggestedData([...DUMMY_SUGGESTED_DATA]);
  }, [DUMMY_SUGGESTED_DATA]);

  useEffect(() => {
    getSuggestionList();
  }, [getSuggestionList]);

  useEffect(() => {
    setRelatedData([...DUMMY_RELATED_DATA]);
  }, [DUMMY_RELATED_DATA]);

  return (
    <div className={classes.wrap}>
      {resultData.length === 0 ? (
        <Fragment>
          <div className={classes.emptyImg}>
            <img src={emptyImage} alt='empty' />
          </div>
          <div className={classes.emptyComment}>검색 결과가 없어요.</div>
          <span className={classes.emptySuggestion}>
            최근 사람들이 많이 검색한 인기 장소는 어떠신가요?
          </span>
          <h3 className={classes.emptyTitle}>인기 장소 현황</h3>
          <div className={classes.listWrap}>
            {suggestedData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`suggested-data-${idx}`} place={data} />
            ))}
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={classes.subComponent}>
            <div className={classes.header}>
              <span className={classes.title}>검색 결과</span>
              <span className={classes.dataLength}>{resultData.length}</span>
            </div>
            {resultData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`result-data-${idx}`} place={data} />
            ))}
          </div>
          <div className={classes.subComponent}>
            <div className={classes.header}>
              <span className={classes.title}>관련 검색 결과</span>
            </div>
            {relatedData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`related-data-${idx}`} place={data} />
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ResultData;
