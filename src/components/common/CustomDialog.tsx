import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useStore } from 'stores';
import { palette } from 'constants/palette';
import logo from 'assets/temp-logo.png';
import closeIcon from 'assets/icons/close-icon.svg';
import accidentIcon from 'assets/icons/accident-icon.svg';
import footerImage from 'assets/intro-footer-image.png';
import { accidentType } from 'types/typeBundle';

const useStyles = makeStyles(() => ({
  wrap: {
    '& .MuiPaper-root': {
      borderRadius: 8,
      maxHeight: 408,
      backgroundColor: 'transparent',
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
}));

const IntroContent = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.title}>와글와글에 오신 것을 환영합니다.</div>
      텍스트만 변경될거에요 텍스트만 변경될거에요텍스트만 변경될거에요텍스트만 변경될거에요텍스트만
      변경될거에요텍스트만 변경될거에요텍스트만 변경될거에요텍스트만 변경될거에요텍스트만
      변경될거에요텍스트만 변경될거에요텍스트만 변경될거에요텍스트만 변경될거에요텍스트만
      변경될거에요텍스트만
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
            <Box
              className={classes.title}
              sx={{ marginBottom: CustomDialogStore.variant === 'intro' ? '16px' : '8px' }}
            >
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

const CustomDialog = observer(() => {
  const classes = useStyles();
  const { ScreenSizeStore, CustomDialogStore } = useStore().MobxStore;
  const dialogWidth: number = ScreenSizeStore.screenType === 'mobile' ? 295 : 400;

  const closeDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  return (
    <Dialog className={classes.wrap} open={CustomDialogStore.open} onClose={closeDialog}>
      <Box className={classes.closeButtonWrap} sx={{ width: `${dialogWidth}px` }}>
        <IconButton onClick={closeDialog}>
          <img src={closeIcon} alt='close' />
        </IconButton>
      </Box>
      <DialogTitle
        className={classes.header}
        sx={{ padding: '36px 28px', width: `${dialogWidth - 48}px` }}
      >
        {CustomDialogStore.variant === 'intro' && (
          <img className={classes.logo} src={logo} alt='logo' />
        )}
        {CustomDialogStore.variant === 'accident' && (
          <img className={classes.accidentIcon} src={accidentIcon} alt='accident' />
        )}
      </DialogTitle>
      <DialogContent className={classes.content} sx={{ width: `${dialogWidth - 48}px` }}>
        {CustomDialogStore.variant === 'intro' ? <IntroContent /> : <AccidentContent />}
      </DialogContent>
      {CustomDialogStore.variant === 'intro' && (
        <img className={classes.footerImage} src={footerImage} alt='footer' />
      )}
    </Dialog>
  );
});

export default CustomDialog;
