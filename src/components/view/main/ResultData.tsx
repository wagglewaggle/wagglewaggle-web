import { useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import lottie from 'lottie-web';
import { request } from 'api/request';
import { PlaceDataType, ScreenType } from 'types/typeBundle';
import { palette, locationNames, districts } from 'constants/';

interface propsType {
  searchWord: string;
}

const ResultData = observer((props: propsType) => {
  const { searchWord } = props;
  const [resultData, setResultData] = useState<PlaceDataType[]>([]);
  const [relatedData, setRelatedData] = useState<PlaceDataType[]>([]);
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { LocationStore, ScreenSizeStore, ThemeStore } = useStore().MobxStore;
  const { allPlaces } = LocationStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const getSuggestionList = useCallback(async () => {
    setResultData(
      allPlaces.filter((data: PlaceDataType) =>
        (locationNames[data.name] || data.name).includes(searchWord)
      )
    );
  }, [allPlaces, searchWord]);

  const pushPlaceData = (
    places: PlaceDataType[],
    newPlaces: string[],
    newRelatedData: PlaceDataType[]
  ) => {
    places.forEach((place: PlaceDataType) => {
      if (!newPlaces.includes(place.name)) {
        newPlaces.push(place.name);
        newRelatedData.push(place);
      }
    });
  };

  const getRelatedData = useCallback(() => {
    const newRelatedData: PlaceDataType[] = [];
    const newPlaces: string[] = [];
    resultData.forEach(async (data: PlaceDataType, idx: number) => {
      if (!districts[data.name]) return;
      const response = await request.getLocationData(districts[data.name]);
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
  }, [ThemeStore.theme]);

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
    <Wrap screenType={ScreenSizeStore.screenType} screenWidth={ScreenSizeStore.screenWidth}>
      {resultData.length === 0 ? (
        <>
          <Empty>
            <Lottie ref={lottieContainer} />
          </Empty>
          <EmptyComment>검색 결과가 없어요.</EmptyComment>
          <EmptySuggestion isDarkTheme={isDarkTheme}>다른 장소를 검색해보세요.</EmptySuggestion>
        </>
      ) : (
        <>
          <SubComponent>
            <Header>
              <Title>{`검색 결과 ${resultData.length}`}</Title>
            </Header>
            {resultData.map((data: PlaceDataType, idx: number) => (
              <PlaceCard key={`result-data-${idx}`} place={data} />
            ))}
          </SubComponent>
          {relatedData.length > 0 && (
            <SubComponent>
              <Header>
                <Title>관련 장소 현황</Title>
              </Header>
              {relatedData.map((data: PlaceDataType, idx: number) => (
                <PlaceCard key={`related-data-${idx}`} place={data} />
              ))}
            </SubComponent>
          )}
        </>
      )}
    </Wrap>
  );
});

export default ResultData;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => !['screenType', 'screenWidth'].includes(prop),
})<{ screenType: ScreenType; screenWidth: number }>(({ screenType, screenWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '5px 24px 35px',
  width: screenType === 'mobile' ? screenWidth - 48 : 352,
}));

const Empty = styled('div')({
  margin: '40px 0 24px',
  width: 120,
  height: 120,
});

const Lottie = styled('div')({
  width: 120,
  height: 120,
  overflow: 'hidden',
});

const EmptyComment = styled('div')({
  fontSize: 18,
  fontWeight: 600,
});

const EmptySuggestion = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  margin: '8px 0 64px',
  color: palette.grey[isDarkTheme ? 400 : 500],
  fontSize: 14,
  fontWeight: 400,
}));

const SubComponent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const Header = styled('div')({
  display: 'flex',
  paddingBottom: 5,
  fontSize: 14,
  '& svg': {
    display: 'none',
  },
});

const Title = styled('span')({
  margin: '32px 0 24px',
  fontSize: 18,
  fontWeight: 600,
});
