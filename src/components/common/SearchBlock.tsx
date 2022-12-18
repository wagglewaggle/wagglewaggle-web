import { Fragment } from 'react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { searchWordList } from 'types/typeBundle';
import { palette } from 'constants/';

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
    color: palette.white,
    fontSize: 14,
    fontWeight: 700,
  },
  listWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    flexGrow: 1,
    padding: '5px 0',
    maxWidth: 380,
    color: palette.white,
    fontSize: 12,
    cursor: 'pointer',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    border: 0,
    padding: 0,
    backgroundColor: palette.transparent,
    color: palette.white,
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
  },
}));

interface propsType {
  title: string;
  blockList: searchWordList[];
  onClickRemoveAll: () => void;
  onClickRemoveOne?: (listId: number) => void;
  handleWordClick: (searchWord: string) => void;
}

const SearchBlock = (props: propsType) => {
  const { title, blockList, onClickRemoveAll, onClickRemoveOne, handleWordClick } = props;
  const classes = useStyles();

  const handleListClick = (word: string) => {
    handleWordClick(word);
  };

  return (
    <div className={classes.subComponent}>
      <div className={classes.header}>
        <span className={classes.title}>{title}</span>
        <button className={classes.removeButton} onClick={onClickRemoveAll}>
          모두 지우기
        </button>
      </div>
      {blockList.length > 0 ? (
        blockList.map((list: searchWordList, idx: number) => (
          <div key={`search-list-${idx}`} className={classes.listWrap}>
            <div className={classes.list} onClick={() => handleListClick(list.word)}>
              {list.word}
            </div>
            {onClickRemoveOne && (
              <IconButton
                sx={{
                  marginLeft: '5px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: palette.grey[600],
                }}
                onClick={() => onClickRemoveOne(list.id)}
              >
                <CloseIcon
                  sx={{
                    width: '11px',
                    height: '11px',
                    color: palette.black,
                  }}
                />
              </IconButton>
            )}
          </div>
        ))
      ) : (
        <Fragment>{`${title}가 없어요.`}</Fragment>
      )}
    </div>
  );
};

export default SearchBlock;
