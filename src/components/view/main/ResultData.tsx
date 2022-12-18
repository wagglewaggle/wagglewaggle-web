import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import emptyImage from 'assets/error-image.png';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px 24px 35px',
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
    paddingBottom: 5,
    fontSize: 14,
  },
  title: {
    margin: '32px 0 24px',
    fontSize: 18,
    fontWeight: 600,
  },
}));

interface propsType {
  placeData: placeDataType[];
  searchWord: string;
}

const ResultData = observer((props: propsType) => {
  const { placeData, searchWord } = props;
  const [resultData, setResultData] = useState<placeDataType[]>([]);
  const [relatedData, setRelatedData] = useState<placeDataType[]>([]);
  const [suggestedData, setSuggestedData] = useState<placeDataType[]>([]);
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;
  const WRAP_BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth - 48 : 352,
  };
  const DUMMY_RELATED_DATA: placeDataType[] = useMemo(
    () => [
      { id: 2, name: 'test7', category: 'category7', status: 'CROWDED' },
      { id: 3, name: 'test8', category: 'category8', status: 'VERY_CROWDED' },
      { id: 4, name: 'test9', category: 'category9', status: 'NORMAL' },
      { id: 5, name: 'test10', category: 'category10', status: 'VERY_RELAXATION' },
    ],
    []
  );
  const DUMMY_SUGGESTED_DATA: placeDataType[] = useMemo(
    () => [
      { id: 6, name: '여의나루역', category: 'category7', status: 'CROWDED' },
      { id: 7, name: 'IFC몰', category: 'category8', status: 'RELAXATION' },
    ],
    []
  );

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
    <Box className={classes.wrap} sx={WRAP_BOX_STYLE}>
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
              <span className={classes.title}>{`검색 결과 ${resultData.length}`}</span>
            </div>
            {resultData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`result-data-${idx}`} place={data} />
            ))}
          </div>
          <div className={classes.subComponent}>
            <div className={classes.header}>
              <span className={classes.title}>관련 장소 현황</span>
            </div>
            {relatedData.map((data: placeDataType, idx: number) => (
              <PlaceCard key={`related-data-${idx}`} place={data} />
            ))}
          </div>
        </Fragment>
      )}
    </Box>
  );
});

export default ResultData;
