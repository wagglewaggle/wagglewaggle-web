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
  const { variant, open } = CustomDialogStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const closeDialog = () => {
    if (variant === 'intro') {
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
    if (ScreenSizeStore.screenType === 'mobile' && variant === 'cctv') {
      setDialogWidth(300);
      return;
    }
    setDialogWidth(
      (ScreenSizeStore.screenType === 'mobile' ? 295 : 408) - (variant === 'cctv' ? 40 : 0)
    );
  }, [ScreenSizeStore.screenType, variant]);

  useEffect(() => {
    setDialogHeight(variant === 'intro' ? 492 : variant === 'accident' ? 408 : 390);
  }, [variant]);

  return (
    <CustomDialogWrap
      width={dialogWidth}
      height={dialogHeight}
      variant={variant}
      screenType={ScreenSizeStore.screenType}
      isDarkTheme={isDarkTheme}
      open={open}
      onClose={closeDialog}
    >
      <CloseButtonWrap width={dialogWidth} variant={variant}>
        <IconButton onClick={closeDialog}>
          <img src={closeIcon} alt='close' />
        </IconButton>
      </CloseButtonWrap>
      <DialogPart
        isDarkTheme={isDarkTheme}
        variant={variant}
        width={dialogWidth - (variant === 'intro' ? 16 : 0)}
      >
        <DialogTitle>
          {variant === 'intro' && <CustomIcon src={logo} alt='logo' />}
          {variant === 'accident' && <CustomIcon src={accidentIcon} alt='accident' />}
        </DialogTitle>
        <CustomContent width={dialogWidth} variant={variant}>
          {variant === 'intro' ? (
            <IntroContent />
          ) : variant === 'accident' ? (
            <AccidentContent />
          ) : (
            <CctvContent isDialog />
          )}
        </CustomContent>
        {variant === 'accident' && <AccidentEmpty isDarkTheme={isDarkTheme} />}
        {variant === 'intro' && <Lottie ref={lottieContainer} />}
      </DialogPart>
    </CustomDialogWrap>
  );
});

export default CustomDialog;

const CustomDialogWrap = styled(Dialog, {
  shouldForwardProp: (prop: string) =>
    !['width', 'height', 'variant', 'screenType', 'isDarkTheme'].includes(prop),
})<{
  width: number;
  height: number;
  variant: 'intro' | 'accident' | 'cctv';
  screenType: ScreenType;
  isDarkTheme: boolean;
}>(({ width, height, variant, screenType, isDarkTheme }) => ({
  '& .MuiPaper-root': {
    height: `${height - (screenType === 'mobile' && variant === 'intro' ? 12 : 0)}px`,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'hidden',
  },
  '& .MuiDialogContent-root': {
    width: `${width - (variant === 'cctv' ? 48 : variant === 'intro' ? 56 : 40)}px`,
    height: variant === 'cctv' ? '320px' : 'skip',
    overflow: 'auto',
    '& img': { filter: isDarkTheme ? 'none' : 'invert(1)' },
  },
}));

const CloseButtonWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['width', 'variant'].includes(prop),
})<{ width: number; variant: 'intro' | 'accident' | 'cctv' }>(({ width, variant }) => ({
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
}));

const DialogPart = styled('div', {
  shouldForwardProp: (prop: string) => !['width', 'variant', 'isDarkTheme'].includes(prop),
})<{
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

const CustomContent = styled(DialogContent, {
  shouldForwardProp: (prop: string) => !['width', 'variant'].includes(prop),
})<{
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

const AccidentEmpty = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
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
