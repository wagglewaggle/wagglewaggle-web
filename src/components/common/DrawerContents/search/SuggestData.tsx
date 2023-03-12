import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchBlock } from 'components/common';
import { useStore } from 'stores';
import { PlaceDataType, ScreenType } from 'types/typeBundle';
import { palette, locationNames } from 'constants/';

interface propsType {
  placeData: PlaceDataType[];
  searchValue: string;
  initialBlockList: string[];
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: string[]) => void;
}

const SuggestData = observer((props: propsType) => {
  const { placeData, searchValue, initialBlockList, handleWordClick, handleLatestListChange } =
    props;
  const [searchBlockList, setSearchBlockList] = useState<string[]>(initialBlockList);
  const [suggestionList, setSuggestionList] = useState<PlaceDataType[]>([]);
  const { LocationStore, ScreenSizeStore } = useStore().MobxStore;

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
    handleWordClick(locationNames[searchWord] || searchWord);
  };

  const getSuggestionList = useCallback(() => {
    const newSuggestionList: PlaceDataType[] = placeData.filter((data: PlaceDataType) =>
      (locationNames[data.name] || data.name).includes(searchValue)
    );
    setSuggestionList(newSuggestionList);
    LocationStore.setSuggestionExists(newSuggestionList.length > 0);
  }, [placeData, searchValue, LocationStore]);

  useEffect(() => {
    getSuggestionList();
  }, [searchValue, getSuggestionList]);

  return (
    <Wrap screenType={ScreenSizeStore.screenType} screenWidth={ScreenSizeStore.screenWidth}>
      {suggestionList.map((list: PlaceDataType, idx: number) => {
        const searchValueIdx: number = (locationNames[list.name] || list.name).indexOf(searchValue);
        const location: string = locationNames[list.name] || list.name;
        return (
          <ListWrap key={`suggest-data-${idx}`} onClick={() => handleListClick(list.name)}>
            <SearchIcon />
            <List>
              {location.substring(0, searchValueIdx)}
              <IncludedString>{searchValue}</IncludedString>
              {location.substring(searchValueIdx + searchValue.length, location.length)}
            </List>
          </ListWrap>
        );
      })}
      {suggestionList.length === 0 && (
        <EmptySuggestion>
          <SearchBlock
            title='최근 검색어'
            blockList={searchBlockList}
            onClickRemoveAll={handleRemoveAllLatestList}
            onClickRemoveOne={handleRemoveLatestList}
            handleWordClick={handleWordClick}
          />
        </EmptySuggestion>
      )}
    </Wrap>
  );
});

export default SuggestData;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => !['screenType', 'screenWidth'].includes(prop),
})<{ screenType: ScreenType; screenWidth: number }>(({ screenType, screenWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '5px 0 35px',
  width: screenType === 'mobile' ? screenWidth : 400,
  minHeight: 'calc(100vh - 97px)',
}));

const ListWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '14px 24px',
  gap: 8,
  cursor: 'pointer',
  '& path': {
    width: 17,
    height: 17,
  },
});

const List = styled('span')({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  height: 24,
  fontSize: 14,
  fontWeight: 600,
  whiteSpace: 'pre-wrap',
});

const IncludedString = styled('span')({
  color: palette.orange,
});

const EmptySuggestion = styled('div')({
  padding: '0 24px',
  fontSize: 14,
  fontWeight: 400,
});
