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
      height: 492,
      backgroundColor: 'transparent',
      boxShadow: 'none',
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
  dialogPart: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  icon: {
    width: 48,
    height: 48,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontSize: 18,
    fontWeight: 600,
    zIndex: 2,
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
    position: 'relative',
    fontSize: 14,
    fontWeight: 400,
    zIndex: 2,
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
    borderRadius: 8,
    width: '100%',
    height: 'calc(100% - 48px)',
    zIndex: 1,
    overflow: 'hidden',
  },
  survey: {
    textDecoration: 'underline',
    textDecorationThickness: 2,
    textUnderlineOffset: '3px',
    fontWeight: 700,
    cursor: 'pointer',
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
      {variant === 'intro' && <img className={classes.icon} src={logo} alt='logo' />}
      {variant === 'accident' && <img className={classes.icon} src={accidentIcon} alt='accident' />}
    </DialogTitle>
  );
};

const IntroContent = () => {
  const classes = useStyles();

  const openSurveyPage = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSenqtgHZbuI5RIOYXzYE4217OcZco2Uxb44xl_zHQ_DQAj9Iw/viewform',
      '_blank'
    );
  };

  return (
    <Fragment>
      <Box className={classes.title} sx={{ marginBottom: '16px' }}>
        와글와글에게 여러분의 목소리를 들려주세요.
      </Box>
      <Box sx={{ lineHeight: '20px' }}>
        와글와글을 더욱 더 발전시키기 위해 사용자 인터뷰 대상자를 모집합니다. 참여해주신 분들에겐
        소정의 사례금을 드립니다. 많은 참여 부탁드립니다 🙇🏻‍♂️🙇🏻‍♀️
        <br />
        <br />
        <span className={classes.survey} onClick={openSurveyPage}>
          참여하러 가기 🔗
        </span>
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
    const introAnimation = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/${ThemeStore.theme}/Notice${
        ScreenSizeStore.screenType === 'mobile' ? '-mobile' : ''
      }.json`),
    });
    return () => introAnimation.destroy();
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
          overflow: 'hidden',
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
          height: CustomDialogStore.variant === 'cctv' ? 'fit-content' : 'skip',
          overflow: 'auto',
          '& img': {
            filter: isDarkTheme ? 'none' : 'invert(1)',
          },
          '&::-webkit-scrollbar': {
            width: '10px',
            color: palette.grey[isDarkTheme ? 500 : 300],
            background: isDarkTheme ? palette.grey[700] : palette.white,
          },
          '&::-webkit-scrollbar-thumb': {
            borderLeft: '2px solid transparent',
            boxShadow: `inset 0 0 10px 10px ${isDarkTheme ? palette.grey[700] : palette.white}`,
            background: palette.grey[isDarkTheme ? 500 : 300],
          },
          '&::-webkit-scrollbar-track': {
            background: isDarkTheme ? palette.grey[700] : palette.white,
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
      <Box
        className={classes.dialogPart}
        sx={{
          color: isDarkTheme ? palette.white : palette.black,
          backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
        }}
      >
        <TitlePart
          variant={CustomDialogStore.variant}
          dialogWidth={dialogWidth - (CustomDialogStore.variant === 'intro' ? 16 : 0)}
        />
        <DialogContent
          className={classes.content}
          sx={{
            width: `${dialogWidth - 48 - (CustomDialogStore.variant === 'intro' ? 16 : 0)}px`,
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
      </Box>
    </Dialog>
  );
});

export default CustomDialog;
