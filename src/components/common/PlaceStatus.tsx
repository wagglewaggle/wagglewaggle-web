import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  veryUncrowded: {
    color: palette.blue,
  },
  uncrowded: {
    color: palette.green,
  },
  normal: {
    color: palette.yellow,
  },
  crowded: {
    color: palette.orange,
  },
  veryCrowded: {
    color: palette.red,
  },
}));

interface propsType {
  status: statusType;
  comments?: { [key: string]: string };
  sx?: object;
}

const PlaceStatus = (props: propsType) => {
  const {
    status,
    comments = {
      'very uncrowded': '매우 여유',
      uncrowded: '여유',
      normal: '보통',
      crowded: '붐빔',
      'very crowded': '매우 붐빔',
    },
    sx = {},
  } = props;
  const classes = useStyles();

  return (
    <Box sx={sx} component='span'>
      {status === 'very uncrowded' ? (
        <span className={classes.veryUncrowded}>{comments[status]}</span>
      ) : status === 'uncrowded' ? (
        <span className={classes.uncrowded}>{comments[status]}</span>
      ) : status === 'normal' ? (
        <span className={classes.normal}>{comments[status]}</span>
      ) : status === 'crowded' ? (
        <span className={classes.crowded}>{comments[status]}</span>
      ) : (
        <span className={classes.veryCrowded}>{comments[status]}</span>
      )}
    </Box>
  );
};

export default PlaceStatus;
