import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
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
    color: palette.white,
    fontSize: 14,
    fontWeight: 600,
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
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyData: {
    marginTop: 9,
    color: palette.grey[400],
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
            <IconButton
              sx={{
                padding: 0,
                marginLeft: '5px',
                width: '16px',
                height: '16px',
                backgroundColor: palette.grey[600],
              }}
              disableRipple
              onClick={() => onClickRemoveOne(list)}
            >
              <CloseIcon
                sx={{
                  width: '11px',
                  height: '11px',
                  color: palette.black,
                }}
              />
            </IconButton>
          </div>
        ))
      ) : (
        <div className={classes.emptyData}>{`${title}가 없어요.`}</div>
      )}
    </div>
  );
};

export default SearchBlock;
