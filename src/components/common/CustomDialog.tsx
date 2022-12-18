import { Fragment } from 'react';
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
    '& .MuiDialogContent-root': {
      width: 360,
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
  },
  content: {
    color: palette.white,
    fontSize: 14,
    fontWeight: 400,
    backgroundColor: palette.grey[700],
    '& div:last-of-type': {
      margin: 0,
    },
  },
  footerImage: {
    backgroundColor: palette.grey[700],
  },
}));

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

const CustomDialog = observer(() => {
  const classes = useStyles();
  const { ScreenSizeStore, CustomDialogStore } = useStore().MobxStore;
  const dialogWidth: number = ScreenSizeStore.screenType === 'mobile' ? 295 : 400;

  const closeDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  return (
    <Dialog
      className={classes.wrap}
      sx={{
        '& .MuiPaper-root': {
          maxHeight: `${CustomDialogStore.variant === 'intro' ? 492 : 408}px`,
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
      <DialogContent
        className={classes.content}
        sx={{
          width: `${dialogWidth - 48}px`,
          height: CustomDialogStore.variant === 'intro' ? 'auto' : '200px',
        }}
      >
        {CustomDialogStore.variant === 'intro' ? <IntroContent /> : <AccidentContent />}
      </DialogContent>
      <Box sx={{ height: '20px', width: '100%', backgroundColor: palette.grey[700] }} />
      {CustomDialogStore.variant === 'intro' && (
        <img className={classes.footerImage} src={footerImage} alt='footer' />
      )}
    </Dialog>
  );
});

export default CustomDialog;
