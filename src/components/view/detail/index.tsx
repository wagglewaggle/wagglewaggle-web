import { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import DetailHeader from './DetailHeader';
import DetailContent from './DetailContent';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 35,
    width: '100%',
    color: palette.white,
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

const Detail = () => {
  const [status, setStatus] = useState<statusType>('normal');
  const classes = useStyles();

  useEffect(() => {
    setStatus('normal');
  }, []);

  return (
    <div className={classes.wrap}>
      <DetailHeader status={status} rootClasses={classes} />
      <DetailContent status={status} rootClasses={classes} />
    </div>
  );
};

export default Detail;
