import { useState, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/';
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
    color: palette.white,
    '& button': {
      border: 'none',
      color: palette.white,
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
    color: palette.black,
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: palette.white,
    gap: 8,
  },
  linkRef: {
    display: 'none',
  },
}));

const Footer = () => {
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyLinkRef = useRef<HTMLInputElement>(null);
  const classes = useStyles();

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
      <div className={classes.buttons}>
        <button onClick={handleContactUsClick}>Contact Us</button>|
        <button onClick={handleShareLinkClick}>Share Link</button>
      </div>
      {linkCopied ? (
        <div className={classes.linkCopyPopup}>
          <img src={linkCheckIcon} alt='link-copy-check' />
          링크가 복사되었습니다.
        </div>
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
};

export default Footer;
