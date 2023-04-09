import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogTitle, DialogContent, IconButton, styled } from '@mui/material';
import { IntroContent, AccidentContent, CctvContent, NotificationContent } from './DialogContents';
import { useStore } from 'stores';
import { palette } from 'constants/';
import Lottie from 'react-lottie-player';
import { ScreenType, DialogVariantType } from 'types/typeBundle';
import logo from 'assets/icons/logo-filled-icon.svg';
import closeIcon from 'assets/icons/close-icon.svg';
import accidentIcon from 'assets/icons/accident-icon.svg';

const CustomDialog = observer(() => {
  const { ScreenSizeStore, CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const [dialogWidth, setDialogWidth] = useState<number>(408);
  const [dialogHeight, setDialogHeight] = useState<number>(408);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const { screenType } = ScreenSizeStore;
  const { variant, open } = CustomDialogStore;

  const closeDialog = () => {
    if (variant === 'intro') {
      sessionStorage.setItem('@wagglewaggle_intro_popup_open', 'false');
    }
    CustomDialogStore.setOpen(false);
  };

  useEffect(() => {
    setAnimationData(
      require(`assets/lottie/${ThemeStore.theme}/Notice${
        screenType === 'mobile' ? '-mobile' : ''
      }.json`)
    );
  }, [screenType, ThemeStore.theme]);

  useEffect(() => {
    if (screenType === 'mobile' && variant === 'cctv') {
      setDialogWidth(300);
      return;
    }
    setDialogWidth((screenType === 'mobile' ? 295 : 408) - (variant === 'cctv' ? 40 : 0));
  }, [screenType, variant]);

  useEffect(() => {
    setDialogHeight(variant === 'intro' ? 492 : variant === 'accident' ? 408 : 360);
  }, [variant]);

  return (
    <CustomDialogWrap
      width={dialogWidth}
      height={dialogHeight}
      variant={variant}
      screenType={screenType}
      isDarkTheme={isDarkTheme}
      open={open}
      onClose={closeDialog}
    >
      <CloseButtonWrap width={variant === 'noti' ? 311 : dialogWidth} variant={variant}>
        <IconButton onClick={closeDialog}>
          <img src={closeIcon} alt='close' />
        </IconButton>
      </CloseButtonWrap>
      <DialogPart
        isDarkTheme={isDarkTheme}
        variant={variant}
        width={variant === 'noti' ? 311 : dialogWidth - (variant === 'intro' ? 16 : 0)}
      >
        {variant !== 'noti' && (
          <DialogTitle>
            {variant === 'intro' && <CustomIcon src={logo} alt='logo' />}
            {variant === 'accident' && <CustomIcon src={accidentIcon} alt='accident' />}
          </DialogTitle>
        )}
        <CustomContent width={dialogWidth} variant={variant}>
          {variant === 'intro' ? (
            <IntroContent />
          ) : variant === 'accident' ? (
            <AccidentContent />
          ) : variant === 'cctv' ? (
            <CctvContent />
          ) : (
            <NotificationContent />
          )}
        </CustomContent>
        {variant === 'accident' && <AccidentEmpty isDarkTheme={isDarkTheme} />}
        {variant === 'intro' && animationData && (
          <CustomLottie loop play animationData={animationData} />
        )}
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
  variant: DialogVariantType;
  screenType: ScreenType;
  isDarkTheme: boolean;
}>(({ width, height, variant, screenType, isDarkTheme }) => ({
  '& .MuiPaper-root': {
    height: variant === 'noti' ? 'auto' : 492,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'hidden',
    maxHeight:
      variant === 'noti'
        ? 'auto'
        : `${height - (screenType === 'mobile' && variant === 'intro' ? 12 : 0)}px`,
  },
  '& .MuiDialogContent-root': {
    padding: variant === 'noti' ? 0 : 'auto',
    width:
      variant === 'noti'
        ? 311
        : `${width - (variant === 'cctv' ? 48 : variant === 'intro' ? 56 : 40)}px`,
    height: ['cctv', 'noti'].includes(variant) ? 'fit-content' : 'skip',
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

const CloseButtonWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['width', 'variant'].includes(prop),
})<{ width: number; variant: DialogVariantType }>(({ width, variant }) => ({
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
  variant: DialogVariantType;
  width: number;
}>(({ isDarkTheme, variant, width }) => ({
  borderRadius: 8,
  width,
  height: variant === 'noti' ? 'fit-content' : '100%',
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
  variant: DialogVariantType;
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

const CustomLottie = styled(Lottie)({
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
