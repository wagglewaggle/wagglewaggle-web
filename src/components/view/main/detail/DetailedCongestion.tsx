import { Button, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceStatus } from 'components/common';
import { useStore } from 'stores';
import { locationDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import refreshIcon from 'assets/icons/refresh-icon.svg';
import personIcon from 'assets/icons/person-icon.svg';
import rightIcon from 'assets/icons/right-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
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
    padding: 20,
    marginTop: 24,
    width: '100%',
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
}

const DetailedCongestion = (props: propsType) => {
  const { locationData } = props;
  const classes = useStyles();
  const { CustomDialogStore } = useStore().MobxStore;
  const COMMENTS_BY_STATUS: { [key: string]: string } = {
    VERY_RELAXATION: '날아다닐 수 있어요',
    RELAXATION: '여유롭게 이동할 수 있어요',
    NORMAL: '이동하기 불편하지 않아요',
    CROWDED: '이동 시 기다림이 필요해요',
    VERY_CROWDED: '이동하기 힘들어요',
  };

  const handleOpenDialog = () => {
    CustomDialogStore.openCctvDialog([
      'https://data.seoul.go.kr/SeoulRtd/cctv?src=http://210.179.218.51:1935/live/71.stream/playlist.m3u8&cctvname=L010069',
      'https://data.seoul.go.kr/SeoulRtd/cctv?src=http://210.179.218.52:1935/live/149.stream/playlist.m3u8&cctvname=L010126',
    ]);
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>
        <span>실시간 인구 현황</span>
        <div className={classes.buttonArea}>
          <IconButton sx={{ padding: 0 }}>
            <img className={classes.iconImage} src={refreshIcon} alt='refresh' />
          </IconButton>
          5시간 전
        </div>
      </div>
      <div className={classes.statusCard}>
        <div className={classes.statusLeft}>
          <img src={personIcon} alt='person' />
          <div className={classes.statusDesc}>
            <span>인구 현황</span>
            <span>{COMMENTS_BY_STATUS[locationData?.level || 'NORMAL']}</span>
          </div>
        </div>
        <PlaceStatus status={locationData?.level || undefined} />
      </div>
      <hr className={classes.divider} />
      <Button
        sx={{
          justifyContent: 'space-between',
          padding: '12px 0',
          width: '100%',
          color: palette.white,
        }}
        onClick={handleOpenDialog}
      >
        CCTV
        <img src={rightIcon} alt='right' />
      </Button>
    </div>
  );
};

export default DetailedCongestion;
