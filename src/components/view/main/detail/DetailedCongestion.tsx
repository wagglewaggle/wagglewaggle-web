import { Fragment, useState, useEffect } from 'react';
import { Button, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import { useStore } from 'stores';
import { locationDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import refreshIcon from 'assets/icons/refresh-icon.svg';
import personIcon from 'assets/icons/person-icon.svg';
import carIcon from 'assets/icons/car-icon.svg';
import rightIcon from 'assets/icons/right-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 24px 16px',
    backgroundColor: palette.grey[700],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    '& span': {
      fontSize: 18,
      fontWeight: 600,
    },
  },
  buttonArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  iconImage: {
    width: 16,
    height: 16,
  },
  statusCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 24,
    width: '100%',
    fontSize: 14,
    fontWeight: 600,
  },
  trafficStatusCard: {
    margin: 0,
  },
  statusLeft: {
    display: 'flex',
    gap: 8,
    '& img': {
      borderRadius: '50%',
      padding: 8,
      width: 24,
      height: 24,
      backgroundColor: palette.black,
    },
  },
  statusDesc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    '& span:last-child': {
      color: palette.grey[400],
      fontWeight: 400,
    },
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 400,
  },
  cctvButton: {
    border: 'none',
    padding: 0,
    backgroundColor: 'transparent',
    color: palette.white,
  },
  divider: {
    width: '100%',
    border: `1px solid ${palette.grey[600]}`,
  },
}));

interface propsType {
  locationData: locationDataType | null;
  initLocationData: () => void;
}

const DetailedCongestion = (props: propsType) => {
  const { locationData, initLocationData } = props;
  const [timePassed, setTimePassed] = useState<string>('');
  const classes = useStyles();
  const { CustomDialogStore } = useStore().MobxStore;
  const COMMENTS_BY_STATUS: { [key: string]: string } = {
    VERY_RELAXATION: '날아다닐 수 있어요',
    RELAXATION: '여유롭게 이동할 수 있어요',
    NORMAL: '이동하기 불편하지 않아요',
    CROWDED: '이동 시 기다림이 필요해요',
    VERY_CROWDED: '이동하기 힘들어요',
  };
  const TRAFFIC_TO_COMMENTS: { [key: string]: string } = {
    원활: '날아다닐 수 있어요',
    서행: '이동 시간이 소요될 수 있어요',
    정체: '이동하기 힘들어요',
  };

  const handleOpenDialog = () => {
    CustomDialogStore.openCctvDialog(locationData?.cctvs || []);
  };

  useEffect(() => {
    const newTimePassed: number = Math.round(
      (new Date().getTime() - new Date(locationData?.populations[0]?.updatedDate || '').getTime()) /
        60000
    );
    setTimePassed(
      newTimePassed >= 60 ? `${Math.floor(newTimePassed / 60)}시간 전` : `${newTimePassed}분 전`
    );
  }, [locationData]);

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>
        <span>실시간 인구 현황</span>
        <div className={classes.buttonArea}>
          <IconButton sx={{ padding: 0 }} onClick={initLocationData}>
            <img className={classes.iconImage} src={refreshIcon} alt='refresh' />
          </IconButton>
          {timePassed}
        </div>
      </div>
      <div className={classes.statusCard}>
        <div className={classes.statusLeft}>
          <img src={personIcon} alt='person' />
          <div className={classes.statusDesc}>
            <span>인구 현황</span>
            <span>{COMMENTS_BY_STATUS[locationData?.populations[0]?.level || 'NORMAL']}</span>
          </div>
        </div>
        <PlaceStatus status={locationData?.populations[0].level || undefined} />
      </div>
      <div className={`${classes.statusCard} ${classes.trafficStatusCard}`}>
        <div className={classes.statusLeft}>
          <img src={carIcon} alt='car' />
          <div className={classes.statusDesc}>
            <span>도로 현황</span>
            <span>{TRAFFIC_TO_COMMENTS[locationData?.roadTraffic?.type || '서행']}</span>
          </div>
        </div>
        <PlaceStatus
          status={locationData?.roadTraffic?.type || undefined}
          comments={{ 원활: '원활', 서행: '서행', 정체: '정체' }}
        />
      </div>
      {(locationData?.cctvs || []).length > 0 && (
        <Fragment>
          <hr className={classes.divider} />
          <Button
            sx={{
              justifyContent: 'space-between',
              padding: '12px 0',
              width: '100%',
              color: palette.white,
              fontWeight: 600,
            }}
            onClick={handleOpenDialog}
          >
            CCTV
            <img src={rightIcon} alt='right' />
          </Button>
        </Fragment>
      )}
    </div>
  );
};

export default DetailedCongestion;
