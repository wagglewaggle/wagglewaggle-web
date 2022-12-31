import { Fragment, useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useStore } from 'stores';
import { palette } from 'constants/';
import lottie from 'lottie-web';
import { accidentType, cctvType } from 'types/typeBundle';
import logo from 'assets/icons/logo-filled-icon.svg';
import closeIcon from 'assets/icons/close-icon.svg';
import accidentIcon from 'assets/icons/accident-icon.svg';
import leftIcon from 'assets/icons/left-icon.svg';
import rightIcon from 'assets/icons/right-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    '& .MuiPaper-root': {
      borderRadius: 8,
      height: 492,
      backgroundColor: 'transparent',
      boxShadow: 'none',
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
  icon: {
    width: 48,
    height: 48,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 18,
    fontWeight: 600,
  },
  type: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    wordBreak: 'keep-all',
    lineHeight: '24px',
  },
  times: {
    marginBottom: 24,
    lineHeight: '20px',
  },
  content: {
    fontSize: 14,
    fontWeight: 400,
  },
  cctvWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    '& button': {
      padding: 0,
    },
  },
  descWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
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
    width: 6,
    height: 6,
    cursor: 'pointer',
  },
  darkPageCircle: {
    backgroundColor: palette.grey[600],
  },
  lightPageCircle: {
    backgroundColor: palette.grey[300],
  },
  lottie: {
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    width: '100%',
    height: 'calc(100% - 48px)',
    zIndex: 10000,
    overflow: 'hidden',
  },
}));

interface titlePropsType {
  variant: 'intro' | 'accident' | 'cctv';
  dialogWidth: number;
}

const TitlePart = observer((props: titlePropsType) => {
  const { variant, dialogWidth } = props;
  const classes = useStyles();
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  return (
    <DialogTitle
      className={classes.header}
      sx={{
        padding: variant !== 'cctv' ? '36px 28px' : 'auto',
        width: `${dialogWidth - 48}px`,
        backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
      }}
    >
      {variant === 'intro' && <img className={classes.icon} src={logo} alt='logo' />}
      {variant === 'accident' && <img className={classes.icon} src={accidentIcon} alt='accident' />}
    </DialogTitle>
  );
});

const IntroContent = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Box className={classes.title} sx={{ marginBottom: '16px' }}>
        와글와글에 오신 것을 환영합니다.
      </Box>
      <Box sx={{ lineHeight: '20px' }}>
        ‘와글와글’은 SKT와 KT에서 제공하는 인구 혼잡도 데이터를 기반으로, 서울 및 경기도 내 주요
        공간별 인구 혼잡 현황을 알려드립니다. 보고 싶은 위치를 선택하여 그곳의 실시간 인구 혼잡
        현황을 확인해보세요.
        <br />
        <br />
        Happy New Year 🐰
      </Box>
    </Fragment>
  );
};

const AccidentContent = observer(() => {
  const classes = useStyles();
  const { CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  return (
    <Fragment>
      {CustomDialogStore.accidentList.map((accident: accidentType, idx: number) => (
        <Fragment key={`accident-list-${idx}`}>
          <Box
            className={classes.type}
            sx={{
              color: palette.grey[isDarkTheme ? 400 : 500],
            }}
          >
            {accident.type}
          </Box>
          <Box className={classes.title} sx={{ marginBottom: '24px' }}>
            {accident.info}
          </Box>
        </Fragment>
      ))}
    </Fragment>
  );
});

const CctvContent = observer(() => {
  const [cctvIdx, setCctvIdx] = useState<number>(0);
  const classes = useStyles();
  const { ScreenSizeStore, CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const SELECTED_CIRCLE_STYLE: { backgroundColor: string } = {
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };

  const handleCircleClick = (idx: number) => {
    setCctvIdx(idx);
  };

  const moveToPrevCctv = () => {
    setCctvIdx(cctvIdx - 1);
  };

  const moveToNextCctv = () => {
    setCctvIdx(cctvIdx + 1);
  };

  return (
    <div className={classes.cctvWrap}>
      <iframe
        title='CCTV Dialog'
        src={`https://data.seoul.go.kr${CustomDialogStore?.cctvList[cctvIdx]?.src || ''}`}
        width={320 - (ScreenSizeStore.screenType === 'mobile' ? 68 : 0)}
        height={190}
        frameBorder={0}
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: palette.grey[500],
        }}
      />
      <div className={classes.descWrap}>
        <IconButton
          className={cctvIdx === 0 ? classes.buttonDisabled : undefined}
          disabled={cctvIdx === 0}
          onClick={moveToPrevCctv}
        >
          <img src={leftIcon} alt='left' />
        </IconButton>
        <span className={classes.content}>{CustomDialogStore?.cctvList[cctvIdx]?.cctvname}</span>
        <IconButton
          className={
            cctvIdx === CustomDialogStore.cctvList.length - 1 ? classes.buttonDisabled : undefined
          }
          disabled={cctvIdx === CustomDialogStore.cctvList.length - 1}
          onClick={moveToNextCctv}
        >
          <img src={rightIcon} alt='right' />
        </IconButton>
      </div>
      <div className={classes.pageCircleWrap}>
        {CustomDialogStore.cctvList.map((_: cctvType, idx: number) => (
          <Box
            key={`cctv-page-${idx}`}
            className={`${classes.pageCircle} ${
              isDarkTheme ? classes.darkPageCircle : classes.lightPageCircle
            }`}
            sx={cctvIdx === idx ? SELECTED_CIRCLE_STYLE : {}}
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
  const lottieContainer = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const { ScreenSizeStore, CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const closeDialog = () => {
    if (CustomDialogStore.variant === 'intro') {
      sessionStorage.setItem('@wagglewaggle_intro_popup_open', 'false');
    }
    CustomDialogStore.setOpen(false);
  };

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.destroy();
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/${ThemeStore.theme}/Notice${
        ScreenSizeStore.screenType === 'mobile' ? '-mobile' : ''
      }.json`),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ScreenSizeStore.screenType, lottieContainer.current]);

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
          maxHeight: `${
            dialogHeight -
            (ScreenSizeStore.screenType === 'mobile' && CustomDialogStore.variant === 'intro'
              ? 12
              : 0)
          }px`,
        },
        '& .MuiDialogContent-root': {
          width: `${
            dialogWidth -
            (CustomDialogStore.variant === 'cctv'
              ? 48
              : CustomDialogStore.variant === 'intro'
              ? 56
              : 40)
          }px`,
          '& img': {
            filter: isDarkTheme ? 'none' : 'invert(1)',
          },
        },
      }}
      open={CustomDialogStore.open}
      onClose={closeDialog}
    >
      <Box
        className={classes.closeButtonWrap}
        sx={{ width: `${dialogWidth - (CustomDialogStore.variant === 'intro' ? 8 : 0)}px` }}
      >
        <IconButton onClick={closeDialog}>
          <img src={closeIcon} alt='close' />
        </IconButton>
      </Box>
      <TitlePart
        variant={CustomDialogStore.variant}
        dialogWidth={dialogWidth - (CustomDialogStore.variant === 'intro' ? 16 : 0)}
      />
      <DialogContent
        className={classes.content}
        sx={{
          width: `${dialogWidth - 48 - (CustomDialogStore.variant === 'intro' ? 16 : 0)}px`,
          height: CustomDialogStore.variant === 'intro' ? 'auto' : '200px',
          color: isDarkTheme ? palette.white : palette.black,
          backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
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
        <Box
          sx={{
            height: '20px',
            width: '100%',
            backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
          }}
        />
      )}
      {CustomDialogStore.variant === 'intro' && (
        <Box className={classes.lottie} ref={lottieContainer} />
      )}
    </Dialog>
  );
});

export default CustomDialog;
