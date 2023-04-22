import { useState, useEffect } from 'react';
import { styled } from '@mui/material';
import { SearchBlock } from 'components/common';
import { useStore } from 'stores';

interface propsType {
  initialBlockList: string[];
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: string[]) => void;
}

const SearchData = (props: propsType) => {
  const { initialBlockList, handleWordClick, handleLatestListChange } = props;
  const [searchBlockList, setSearchBlockList] = useState<string[]>(initialBlockList);
  const { CustomDrawerStore } = useStore().MobxStore;

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
    CustomDrawerStore.setTitle('검색');
  }, [CustomDrawerStore]);

  return (
    <Wrap>
      <SearchBlock
        title='최근 검색어'
        blockList={searchBlockList}
        onClickRemoveOne={handleRemoveLatestList}
        onClickRemoveAll={handleRemoveAllLatestList}
        handleWordClick={handleWordClick}
      />
    </Wrap>
  );
};

export default SearchData;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '5px 24px 35px',
  width: 'calc(100% - 48px)',
  minHeight: 'calc(100vh - 97px)',
  maxHeight: 'calc(100vh - 97px)',
  overflow: 'hidden auto',
});
