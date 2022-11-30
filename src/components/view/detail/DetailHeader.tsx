import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import RefreshIcon from '@mui/icons-material/Refresh';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px',
  },
  categoryName: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: 500,
  },
  titleWrap: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  placeName: {
    fontSize: 24,
    fontWeight: 700,
  },
  dateWrap: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 400,
  },
}));

const DetailHeader = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrap}>
      <div className={classes.categoryName}>카테고리명</div>
      <div className={classes.titleWrap}>
        <div className={classes.placeName}>여의도</div>
        <div className={classes.dateWrap}>
          <IconButton sx={{ marginRight: '5px' }}>
            <RefreshIcon sx={{ width: '14px', height: '14px' }} />
          </IconButton>
          2022.11.19 11.12.11
        </div>
      </div>
    </div>
  );
};

export default DetailHeader;
