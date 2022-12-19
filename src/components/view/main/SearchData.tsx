import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { SearchBlock } from 'components/common';
import { useStore } from 'stores';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 24px 35px',
  },
}));

interface propsType {
  latestSearchList: string[];
  handleWordClick: (searchWord: string) => void;
  handleLatestListChange: (newList: string[]) => void;
}

const SearchData = observer((props: propsType) => {
  const { latestSearchList, handleWordClick, handleLatestListChange } = props;
  const [searchBlockList, setSearchBlockList] = useState<string[]>([]);
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;
  const WRAP_BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth - 48 : 352,
  };

  const handleRemoveLatestList = (list: string) => {
    const newList: string[] = JSON.parse(JSON.stringify(latestSearchList));
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
    setSearchBlockList([...latestSearchList]);
  }, [latestSearchList]);

  return (
    <Box className={classes.wrap} sx={WRAP_BOX_STYLE}>
      <SearchBlock
        title='최근 검색어'
        blockList={searchBlockList}
        onClickRemoveOne={handleRemoveLatestList}
        onClickRemoveAll={handleRemoveAllLatestList}
        handleWordClick={handleWordClick}
      />
    </Box>
  );
});

export default SearchData;
