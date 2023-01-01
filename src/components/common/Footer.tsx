import { useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/';
import { useStore } from 'stores';
import linkCheckIcon from 'assets/icons/link-check-icon.svg';

const useStyles = makeStyles(() => ({
  footer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 48,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 191,
    '& button': {
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
  },
  teamName: {
    marginTop: 16,
    height: 44,
    color: palette.grey[500],
    fontSize: 12,
    fontWeight: 500,
  },
  linkCopyPopup: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    padding: '12px 0',
    margin: '16px 0 0',
    width: '100%',
    maxWidth: 400,
    lineHeight: '20px',
    fontSize: 14,
    fontWeight: 600,
    gap: 8,
  },
  linkRef: {
    display: 'none',
  },
}));

const Footer = observer(() => {
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyLinkRef = useRef<HTMLInputElement>(null);
  const classes = useStyles();
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleContactUsClick = () => {
    window.open('https://forms.gle/AcsYE7WzCkQQwisP7', '_blank');
  };

  const handleShareLinkClick = () => {
    if (!copyLinkRef.current) return;
    copyLinkRef.current.focus();
    copyLinkRef.current.select();
    navigator.clipboard.writeText(copyLinkRef.current.value);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  return (
    <footer className={classes.footer}>
      <Box
        className={classes.buttons}
        sx={{ '& button': { color: isDarkTheme ? palette.white : palette.black } }}
      >
        <button onClick={handleContactUsClick}>Contact Us</button>|
        <button onClick={handleShareLinkClick}>Share Link</button>
      </Box>
      {linkCopied ? (
        <Box
          className={classes.linkCopyPopup}
          sx={{
            color: isDarkTheme ? palette.black : palette.white,
            backgroundColor: isDarkTheme ? palette.white : palette.black,
          }}
        >
          <img src={linkCheckIcon} alt='link-copy-check' />
          링크가 복사되었습니다.
        </Box>
      ) : (
        <div className={classes.teamName}>© 2022 Team EXIT</div>
      )}
      <input
        className={classes.linkRef}
        ref={copyLinkRef}
        value={window.location.href}
        onChange={() => {}}
      />
    </footer>
  );
});

export default Footer;
