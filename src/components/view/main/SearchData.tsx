import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { SearchBlock } from 'components/common';
import { ScreenType } from 'types/typeBundle';
import { useStore } from 'stores';

interface propsType {
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: string[]) => void;
  handleSearchValueChange: (newValue: string) => void;
}

const SearchData = observer((props: propsType) => {
  const { handleWordClick, handleLatestListChange, handleSearchValueChange } = props;
  const [searchBlockList, setSearchBlockList] = useState<string[]>([]);
  const { ScreenSizeStore } = useStore().MobxStore;

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

  useEffect(() => {
    handleSearchValueChange('');
  }, [handleSearchValueChange]);

  useEffect(() => {
    setSearchBlockList(JSON.parse(localStorage.getItem('@wagglewaggle_recently_searched') ?? '[]'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('@wagglewaggle_recently_searched')]);

  return (
    <Wrap screenType={ScreenSizeStore.screenType} screenWidth={ScreenSizeStore.screenWidth}>
      <SearchBlock
        title='최근 검색어'
        blockList={searchBlockList}
        onClickRemoveOne={handleRemoveLatestList}
        onClickRemoveAll={handleRemoveAllLatestList}
        handleWordClick={handleWordClick}
      />
    </Wrap>
  );
});

export default SearchData;

const Wrap = styled('div')<{ screenType: ScreenType; screenWidth: number }>(
  ({ screenType, screenWidth }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 24px 35px',
    width: screenType === 'mobile' ? screenWidth - 48 : 352,
  })
);
