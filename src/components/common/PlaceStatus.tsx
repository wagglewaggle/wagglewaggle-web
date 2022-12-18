import { Fragment } from 'react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/';

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
  status?: statusType;
  comments?: { [key: string]: string };
  sx?: object;
}

const PlaceStatus = (props: propsType) => {
  const {
    status,
    comments = {
      VERY_RELAXATION: '매우 여유',
      RELAXATION: '여유',
      NORMAL: '보통',
      CROWDED: '붐빔',
      VERY_CROWDED: '매우 붐빔',
    },
    sx = {},
  } = props;
  const classes = useStyles();

  return (
    <Box sx={{ ...sx, minWidth: 'fit-content' }} component='span'>
      {status === 'VERY_RELAXATION' ? (
        <span className={classes.veryUncrowded}>{comments[status]}</span>
      ) : status === 'RELAXATION' ? (
        <span className={classes.uncrowded}>{comments[status]}</span>
      ) : status === 'NORMAL' ? (
        <span className={classes.normal}>{comments[status]}</span>
      ) : status === 'CROWDED' ? (
        <span className={classes.crowded}>{comments[status]}</span>
      ) : status === 'VERY_CROWDED' ? (
        <span className={classes.veryCrowded}>{comments[status]}</span>
      ) : (
        <Fragment />
      )}
    </Box>
  );
};

export default PlaceStatus;
