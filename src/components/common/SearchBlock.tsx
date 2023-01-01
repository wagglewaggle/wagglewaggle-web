import { observer } from 'mobx-react';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/material';
import CustomCloseIcon from './CustomCloseIcon';
import { palette } from 'constants/';
import { useStore } from 'stores';

const useStyles = makeStyles(() => ({
  subComponent: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 24,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 0',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  listWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    padding: '5px 0',
    maxWidth: 380,
    height: 26,
    fontSize: 14,
    fontWeight: 400,
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    border: 0,
    padding: 0,
    backgroundColor: palette.transparent,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyData: {
    marginTop: 9,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
  },
}));

interface propsType {
  title: string;
  blockList: string[];
  onClickRemoveAll: () => void;
  onClickRemoveOne: (list: string) => void;
  handleWordClick: (searchWord: string) => void;
}

const SearchBlock = observer((props: propsType) => {
  const { title, blockList, onClickRemoveAll, onClickRemoveOne, handleWordClick } = props;
  const classes = useStyles();
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleListClick = (word: string) => {
    handleWordClick(word);
  };

  const handleIconClick = (list: string) => {
    onClickRemoveOne(list);
  };

  return (
    <div className={classes.subComponent}>
      <div className={classes.header}>
        <span className={classes.title}>{title}</span>
        {blockList.length > 0 && (
          <button className={classes.removeButton} onClick={onClickRemoveAll}>
            모두 지우기
          </button>
        )}
      </div>
      {blockList.length > 0 ? (
        blockList.map((list: string, idx: number) => (
          <div key={`search-list-${idx}`} className={classes.listWrap}>
            <div className={classes.list} onClick={() => handleListClick(list)}>
              {list}
            </div>
            <CustomCloseIcon handleIconClick={() => handleIconClick(list)} />
          </div>
        ))
      ) : (
        <Box
          className={classes.emptyData}
          sx={{
            color: palette.grey[isDarkTheme ? 400 : 500],
          }}
        >{`${title}가 없어요.`}</Box>
      )}
    </div>
  );
});

export default SearchBlock;
