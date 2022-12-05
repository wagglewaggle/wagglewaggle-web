import { useState } from 'react';
import { Button, IconButton, ClassNameMap } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CctvDialog from './CctvDialog';
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
    marginTop: 12,
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
    '& button': {
      color: palette.grey[400],
      '& img': {
        color: palette.grey[400],
      },
    },
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
  rootClasses: ClassNameMap<'veryUncrowded' | 'uncrowded' | 'normal' | 'crowded' | 'veryCrowded'>;
}

const DetailContent = (props: propsType) => {
  const { status, rootClasses } = props;
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const ELEMENTS_BY_STATUS: { [key: string]: { comment: string; element: JSX.Element } } = {
    veryUncrowded: {
      comment: '날아다닐 수 있어요',
      element: <span className={`${classes.status} ${rootClasses.veryUncrowded}`}>매우 여유</span>,
    },
    uncrowded: {
      comment: '여유롭게 이동할 수 있어요',
      element: <span className={`${classes.status} ${rootClasses.uncrowded}`}>여유</span>,
    },
    normal: {
      comment: '이동하기 불편하지 않아요',
      element: <span className={`${classes.status} ${rootClasses.normal}`}>보통</span>,
    },
    crowded: {
      comment: '이동 시 기다림이 필요해요',
      element: <span className={`${classes.status} ${rootClasses.crowded}`}>붐빔</span>,
    },
    veryCrowded: {
      comment: '이동하기 힘들어요',
      element: <span className={`${classes.status} ${rootClasses.veryCrowded}`}>매우 붐빔</span>,
    },
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
        <IconButton>
          <img src={refreshIcon} alt='refresh' />
        </IconButton>
      </div>
      <div className={classes.statusCard}>
        <div className={classes.statusLeft}>
          <img src={personIcon} alt='person' />
          <div className={classes.statusDesc}>
            <span>인구 현황</span>
            <span>{ELEMENTS_BY_STATUS[status].comment}</span>
          </div>
        </div>
        {ELEMENTS_BY_STATUS[status].element}
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

export default DetailContent;
