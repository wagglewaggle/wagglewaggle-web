import { Fragment, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useStore } from 'stores';
import { palette } from 'constants/';
import logo from 'assets/temp-logo.png';
import closeIcon from 'assets/icons/close-icon.svg';
import accidentIcon from 'assets/icons/accident-icon.svg';
import footerImage from 'assets/intro-footer-image.png';
import { accidentType } from 'types/typeBundle';

const useStyles = makeStyles(() => ({
  wrap: {
    '& .MuiPaper-root': {
      borderRadius: 8,
      height: 492,
      backgroundColor: 'transparent',
    },
    '& ::-webkit-scrollbar': {
      color: palette.grey[500],
      background: palette.grey[700],
      width: 10,
    },
    '& ::-webkit-scrollbar-thumb': {
      borderLeft: '2px solid transparent',
      boxShadow: `inset 0 0 10px 10px ${palette.grey[700]}`,
      background: palette.grey[500],
    },
    '& ::-webkit-scrollbar-track': {
      background: palette.grey[700],
    },
  },
  closeButtonWrap: {
    padding: 0,
    textAlign: 'end',
    backgroundColor: 'transparent',
    '& button': {
      padding: '0 0 16px 0',
    },
    '& img': {
      width: '32px',
      height: '32px',
    },
  },
  logo: {
    width: 56,
    height: 32,
  },
  accidentIcon: {
    width: 48,
    height: 48,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    color: palette.white,
    fontSize: 18,
    fontWeight: 600,
    backgroundColor: palette.grey[700],
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    wordBreak: 'keep-all',
  },
  times: {
    marginBottom: 24,
    lineHeight: '20px',
  },
  content: {
    color: palette.white,
    fontSize: 14,
    fontWeight: 400,
    backgroundColor: palette.grey[700],
  },
  footerImage: {
    backgroundColor: palette.grey[700],
  },
  cctvWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  pageCircleWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
    gap: 8,
  },
  pageCircle: {
    borderRadius: '50%',
    width: 10,
    height: 10,
    backgroundColor: palette.grey[600],
  },
  selectedCircle: {
    backgroundColor: palette.white,
  },
}));

interface titlePropsType {
  variant: 'intro' | 'accident' | 'cctv';
  dialogWidth: number;
}

const TitlePart = (props: titlePropsType) => {
  const { variant, dialogWidth } = props;
  const classes = useStyles();

  return (
    <DialogTitle
      className={classes.header}
      sx={{
        padding: variant !== 'cctv' ? '36px 28px' : 'auto',
        width: `${dialogWidth - 48}px`,
      }}
    >
      {variant === 'intro' && <img className={classes.logo} src={logo} alt='logo' />}
      {variant === 'accident' && (
        <img className={classes.accidentIcon} src={accidentIcon} alt='accident' />
      )}
    </DialogTitle>
  );
};

const IntroContent = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Box className={classes.title} sx={{ marginBottom: '16px' }}>
        와글와글에 오신 것을 환영합니다.
      </Box>
      ‘와글와글’은 SKT와 KT에서 제공하는 인구 혼잡도 데이터를 기반으로, 서울 및 경기도 내 주요 공간
      별 인구 혼잡도 현황을 알려드립니다. 보고싶은 위치를 선택하여 그곳의 실시간 인구 혼잡도를
      확인해보세요.
      <br />
      <br />
      Merry Christmas 🎄
    </Fragment>
  );
};

const AccidentContent = () => {
  const classes = useStyles();
  const { CustomDialogStore } = useStore().MobxStore;

  return (
    <Fragment>
      {CustomDialogStore.accidentList.map((accident: accidentType, idx: number) => {
        const infoArr: string[] = accident.info.split('|');
        return (
          <Fragment key={`accident-list-${idx}`}>
            <Box className={classes.title} sx={{ marginBottom: '8px' }}>
              {infoArr[0]}
            </Box>
            <div className={classes.times}>
              발생일시: {infoArr[1]}
              <br />
              완료예정: {infoArr[2]}
            </div>
          </Fragment>
        );
      })}
    </Fragment>
  );
};

const CctvContent = observer(() => {
  const [cctvIdx, setCctvIdx] = useState<number>(0);
  const classes = useStyles();
  const { ScreenSizeStore, CustomDialogStore } = useStore().MobxStore;

  const handleCircleClick = (idx: number) => {
    setCctvIdx(idx);
  };

  return (
    <div className={classes.cctvWrap}>
      <iframe
        title='CCTV Dialog'
        src={CustomDialogStore.cctvList[cctvIdx]}
        width={320 - (ScreenSizeStore.screenType === 'mobile' ? 68 : 0)}
        height={190}
        frameBorder={0}
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: palette.grey[500],
        }}
      />
      <span className={classes.content}>CCTV 이름</span>
      <div className={classes.pageCircleWrap}>
        {CustomDialogStore.cctvList.map((_: string, idx: number) => (
          <div
            key={`cctv-page-${idx}`}
            className={`${classes.pageCircle} ${
              cctvIdx === idx ? classes.selectedCircle : undefined
            }`}
            onClick={() => handleCircleClick(idx)}
          />
        ))}
      </div>
    </div>
  );
});

const CustomDialog = observer(() => {
  const [dialogWidth, setDialogWidth] = useState<number>(408);
  const [dialogHeight, setDialogHeight] = useState<number>(408);
  const classes = useStyles();
  const { ScreenSizeStore, CustomDialogStore } = useStore().MobxStore;

  const closeDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  useEffect(() => {
    if (ScreenSizeStore.screenType === 'mobile' && CustomDialogStore.variant === 'cctv') {
      setDialogWidth(300);
      return;
    }
    setDialogWidth(
      (ScreenSizeStore.screenType === 'mobile' ? 295 : 408) -
        (CustomDialogStore.variant === 'cctv' ? 40 : 0)
    );
  }, [ScreenSizeStore.screenType, CustomDialogStore.variant]);

  useEffect(() => {
    setDialogHeight(
      CustomDialogStore.variant === 'intro'
        ? 492
        : CustomDialogStore.variant === 'accident'
        ? 408
        : 360
    );
  }, [CustomDialogStore.variant]);

  return (
    <Dialog
      className={classes.wrap}
      sx={{
        '& .MuiPaper-root': {
          maxHeight: `${dialogHeight}px`,
        },
        '& .MuiDialogContent-root': {
          width: `${dialogWidth - (CustomDialogStore.variant !== 'cctv' ? 40 : 48)}px`,
        },
      }}
      open={CustomDialogStore.open}
      onClose={closeDialog}
    >
      <Box className={classes.closeButtonWrap} sx={{ width: `${dialogWidth}px` }}>
        <IconButton onClick={closeDialog}>
          <img src={closeIcon} alt='close' />
        </IconButton>
      </Box>
      <TitlePart variant={CustomDialogStore.variant} dialogWidth={dialogWidth} />
      <DialogContent
        className={classes.content}
        sx={{
          width: `${dialogWidth - 48}px`,
          height: CustomDialogStore.variant === 'intro' ? 'auto' : '200px',
          '& div:last-of-type': {
            marginBottom: `${CustomDialogStore.variant === 'intro' ? 16 : 0}px`,
          },
        }}
      >
        {CustomDialogStore.variant === 'intro' ? (
          <IntroContent />
        ) : CustomDialogStore.variant === 'accident' ? (
          <AccidentContent />
        ) : (
          <CctvContent />
        )}
      </DialogContent>
      {CustomDialogStore.variant === 'accident' && (
        <Box sx={{ height: '20px', width: '100%', backgroundColor: palette.grey[700] }} />
      )}
      {CustomDialogStore.variant === 'intro' && (
        <img className={classes.footerImage} src={footerImage} alt='footer' />
      )}
    </Dialog>
  );
});

export default CustomDialog;
