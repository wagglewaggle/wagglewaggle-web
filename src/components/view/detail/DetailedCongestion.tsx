import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CctvDialog from './CctvDialog';
import { PlaceStatus } from 'components/common';
import { statusType } from 'types/typeBundle';
import { palette } from 'constants/palette';
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
    fontsize: 14,
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
  status: statusType;
}

const DetailedCongestion = (props: propsType) => {
  const { status } = props;
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const COMMENTS_BY_STATUS: { [key: string]: string } = {
    'very uncrowded': '날아다닐 수 있어요',
    uncrowded: '여유롭게 이동할 수 있어요',
    normal: '이동하기 불편하지 않아요',
    crowded: '이동 시 기다림이 필요해요',
    'very crowded': '이동하기 힘들어요',
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
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
            <span>{COMMENTS_BY_STATUS[status]}</span>
          </div>
        </div>
        <PlaceStatus
          status={status}
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 14,
            fontWeight: 400,
          }}
        />
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
      <CctvDialog open={open} handleCloseDialog={handleCloseDialog} />
    </div>
  );
};

export default DetailedCongestion;
