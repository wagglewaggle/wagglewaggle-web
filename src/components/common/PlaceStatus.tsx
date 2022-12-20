import { Fragment } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 'fit-content',
    fontSize: 14,
    fontWeight: 600,
  },
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
  status?: statusType | string;
  comments?: { [key: string]: string };
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
  } = props;
  const classes = useStyles();

  return (
    <Fragment>
      {status === 'VERY_RELAXATION' || status === '원활' ? (
        <span className={classes.veryUncrowded}>{comments[status]}</span>
      ) : status === 'RELAXATION' ? (
        <span className={classes.uncrowded}>{comments[status]}</span>
      ) : status === 'NORMAL' || status === '서행' ? (
        <span className={classes.normal}>{comments[status]}</span>
      ) : status === 'CROWDED' ? (
        <span className={classes.crowded}>{comments[status]}</span>
      ) : status === 'VERY_CROWDED' || status === '정체' ? (
        <span className={classes.veryCrowded}>{comments[status]}</span>
      ) : (
        <Fragment />
      )}
    </Fragment>
  );
};

export default PlaceStatus;
