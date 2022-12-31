import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import lottie from 'lottie-web';
import axiosRequest from 'api/axiosRequest';
import { placeDataType } from 'types/typeBundle';
import { palette, locationNames, districts } from 'constants/';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '5px 24px 35px',
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
    '& svg': {
      display: 'none',
    },
  },
  title: {
    margin: '32px 0 24px',
    fontSize: 18,
    fontWeight: 600,
  },
  lottie: {
    width: 120,
    height: 120,
    overflow: 'hidden',
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
  const lottieContainer = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const { ScreenSizeStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const WRAP_BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth - 48 : 352,
  };

  const getSuggestionList = useCallback(async () => {
    setResultData(
      placeData.filter((data: placeDataType) =>
        (locationNames[data.name] || data.name).includes(searchWord)
      )
    );
  }, [placeData, searchWord]);

  const pushPlaceData = (
    places: placeDataType[],
    newPlaces: string[],
    newRelatedData: placeDataType[]
  ) => {
    places.forEach((place: placeDataType) => {
      if (!newPlaces.includes(place.name)) {
        newPlaces.push(place.name);
        newRelatedData.push(place);
      }
    });
  };

  const getRelatedData = useCallback(() => {
    const newRelatedData: placeDataType[] = [];
    const newPlaces: string[] = [];
    resultData.forEach(async (data: placeDataType, idx: number) => {
      if (!districts[data.name]) return;
      const response = await axiosRequest(`location/${districts[data.name]}`);
      if (!response?.data?.ktPlaces || !response?.data?.sktPlaces) return;
      pushPlaceData(response.data.ktPlaces, newPlaces, newRelatedData);
      pushPlaceData(response.data.sktPlaces, newPlaces, newRelatedData);
      if (idx === resultData.length - 1) {
        setRelatedData(newRelatedData);
      }
    });
  }, [resultData]);

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/${ThemeStore.theme}/Error.json`),
    });
  }, []);

  useEffect(() => {
    getRelatedData();
  }, [resultData, getRelatedData]);

  useEffect(() => {
    const newSearchedList: string[] = JSON.parse(
      localStorage.getItem('@wagglewaggle_recently_searched') ?? '[]'
    );
    if (!newSearchedList.includes(searchWord)) {
      newSearchedList.push(searchWord);
    }
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newSearchedList));

    const htmlTitle = document.querySelector('title');
    if (!htmlTitle) return;
    htmlTitle.innerHTML = `${searchWord} : 와글와글 검색`;
  }, [searchWord]);

  useEffect(() => {
    getSuggestionList();
  }, [getSuggestionList]);

  return (
    <Box className={classes.wrap} sx={WRAP_BOX_STYLE}>
      {resultData.length === 0 ? (
        <Fragment>
          <div className={classes.emptyImg}>
            <div className={classes.lottie} ref={lottieContainer} />
          </div>
          <div className={classes.emptyComment}>검색 결과가 없어요.</div>
          <Box
            className={classes.emptySuggestion}
            sx={{
              color: palette.grey[isDarkTheme ? 400 : 500],
            }}
          >
            다른 장소를 검색해보세요.
          </Box>
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
          {relatedData.length > 0 && (
            <div className={classes.subComponent}>
              <div className={classes.header}>
                <span className={classes.title}>관련 장소 현황</span>
              </div>
              {relatedData.map((data: placeDataType, idx: number) => (
                <PlaceCard key={`related-data-${idx}`} place={data} />
              ))}
            </div>
          )}
        </Fragment>
      )}
    </Box>
  );
});

export default ResultData;
