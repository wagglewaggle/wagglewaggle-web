import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DetailHeader from './DetailHeader';
import DetailedCongestion from './DetailedCongestion';
import LocationInformation from './LocationInformation';
import RelatedLocations from './RelatedLocations';
import { useStore } from 'stores';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/palette';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 35,
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

const Detail = observer(() => {
  const [status, setStatus] = useState<statusType>('normal');
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;
  const BOX_STYLE: { width: number } = {
    width: ScreenSizeStore.screenType === 'mobile' ? ScreenSizeStore.screenWidth : 640,
  };

  useEffect(() => {
    setStatus('very uncrowded');
  }, []);

  return (
    <Box className={classes.wrap} sx={BOX_STYLE}>
      <DetailHeader status={status} />
      <DetailedCongestion status={status} />
      <LocationInformation />
      <RelatedLocations />
    </Box>
  );
});

export default Detail;
