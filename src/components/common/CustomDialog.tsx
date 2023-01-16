import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogTitle, DialogContent, IconButton, styled } from '@mui/material';
import { IntroContent, AccidentContent, CctvContent } from './DialogContents';
import { useStore } from 'stores';
import { palette } from 'constants/';
import lottie from 'lottie-web';
import { ScreenType } from 'types/typeBundle';
import logo from 'assets/icons/logo-filled-icon.svg';
import closeIcon from 'assets/icons/close-icon.svg';
import accidentIcon from 'assets/icons/accident-icon.svg';

const CustomDialog = observer(() => {
  const [dialogWidth, setDialogWidth] = useState<number>(408);
  const [dialogHeight, setDialogHeight] = useState<number>(408);
  const lottieContainer = useRef<HTMLDivElement>(null);
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
    <CustomDialogWrap
      width={dialogWidth}
      height={dialogHeight}
      variant={CustomDialogStore.variant}
      screenType={ScreenSizeStore.screenType}
      isDarkTheme={isDarkTheme}
      open={CustomDialogStore.open}
      onClose={closeDialog}
    >
      <CloseButtonWrap width={dialogWidth} variant={CustomDialogStore.variant}>
        <IconButton onClick={closeDialog}>
          <img src={closeIcon} alt='close' />
        </IconButton>
      </CloseButtonWrap>
      <DialogPart
        isDarkTheme={isDarkTheme}
        variant={CustomDialogStore.variant}
        width={dialogWidth - (CustomDialogStore.variant === 'intro' ? 16 : 0)}
      >
        <DialogTitle>
          {CustomDialogStore.variant === 'intro' && <CustomIcon src={logo} alt='logo' />}
          {CustomDialogStore.variant === 'accident' && (
            <CustomIcon src={accidentIcon} alt='accident' />
          )}
        </DialogTitle>
        <CustomContent width={dialogWidth} variant={CustomDialogStore.variant}>
          {CustomDialogStore.variant === 'intro' ? (
            <IntroContent />
          ) : CustomDialogStore.variant === 'accident' ? (
            <AccidentContent />
          ) : (
            <CctvContent />
          )}
        </CustomContent>
        {CustomDialogStore.variant === 'accident' && <AccidentEmpty isDarkTheme={isDarkTheme} />}
        {CustomDialogStore.variant === 'intro' && <Lottie ref={lottieContainer} />}
      </DialogPart>
    </CustomDialogWrap>
  );
});

export default CustomDialog;

const CustomDialogWrap = styled(Dialog)<{
  width: number;
  height: number;
  variant: 'intro' | 'accident' | 'cctv';
  screenType: ScreenType;
  isDarkTheme: boolean;
}>(({ width, height, variant, screenType, isDarkTheme }) => ({
  '& .MuiPaper-root': {
    height: 492,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'hidden',
    maxHeight: `${height - (screenType === 'mobile' && variant === 'intro' ? 12 : 0)}px`,
  },
  '& .MuiDialogContent-root': {
    width: `${width - (variant === 'cctv' ? 48 : variant === 'intro' ? 56 : 40)}px`,
    height: variant === 'cctv' ? 'fit-content' : 'skip',
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
}));

const CloseButtonWrap = styled('div')<{ width: number; variant: 'intro' | 'accident' | 'cctv' }>(
  ({ width, variant }) => ({
    padding: 0,
    width: `${width - (variant === 'intro' ? 8 : 0)}px`,
    textAlign: 'end',
    backgroundColor: 'transparent',
    '& button': {
      padding: '0 0 16px 0',
    },
    '& img': {
      width: '32px',
      height: '32px',
    },
  })
);

const DialogPart = styled('div')<{
  isDarkTheme: boolean;
  variant: 'intro' | 'accident' | 'cctv';
  width: number;
}>(({ isDarkTheme, variant, width }) => ({
  borderRadius: 8,
  width: '100%',
  height: '100%',
  color: isDarkTheme ? palette.white : palette.black,
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  '& h2': {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: variant !== 'cctv' ? '36px 28px' : 'auto',
    width: `${width - 48}px`,
    fontSize: 18,
    fontWeight: 600,
    zIndex: 2,
  },
}));

const CustomContent = styled(DialogContent)<{
  width: number;
  variant: 'intro' | 'accident' | 'cctv';
}>(({ width, variant }) => ({
  position: 'relative',
  width: `${width - 48 - (variant === 'intro' ? 16 : 0)}px`,
  height: variant === 'intro' ? 'auto' : '200px',
  fontSize: 14,
  fontWeight: 400,
  zIndex: 2,
  '& div:last-of-type': {
    marginBottom: `${variant === 'intro' ? 16 : 0}px`,
  },
}));

const AccidentEmpty = styled('div')<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  height: '20px',
  width: '100%',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
}));

const Lottie = styled('div')({
  position: 'absolute',
  bottom: 0,
  borderRadius: 8,
  width: '100%',
  height: 'calc(100% - 48px)',
  zIndex: 1,
  overflow: 'hidden',
});

const CustomIcon = styled('img')({
  width: 48,
  height: 48,
});
