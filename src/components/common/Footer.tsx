import { useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { palette } from 'constants/';
import { useStore } from 'stores';
import linkCheckIcon from 'assets/icons/link-check-icon.svg';

const Footer = observer(() => {
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyLinkRef = useRef<HTMLInputElement>(null);
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
    <Wrap>
      <Buttons isDarkTheme={isDarkTheme}>
        <button onClick={handleContactUsClick}>Contact Us</button>|
        <button onClick={handleShareLinkClick}>Share Link</button>
      </Buttons>
      {linkCopied ? (
        <LinkCopyPopup isDarkTheme={isDarkTheme}>
          <img src={linkCheckIcon} alt='link-copy-check' />
          링크가 복사되었습니다.
        </LinkCopyPopup>
      ) : (
        <TeamName>© 2022 Team EXIT</TeamName>
      )}
      <HiddenLink ref={copyLinkRef} value={window.location.href} onChange={() => {}} />
    </Wrap>
  );
});

export default Footer;

const Wrap = styled('div')({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: 48,
});

const Buttons = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: 191,
  '& button': {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: isDarkTheme ? palette.white : palette.black,
  },
}));

const LinkCopyPopup = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
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
  color: isDarkTheme ? palette.black : palette.white,
  backgroundColor: isDarkTheme ? palette.white : palette.black,
}));

const TeamName = styled('div')({
  marginTop: 16,
  height: 44,
  color: palette.grey[500],
  fontSize: 12,
  fontWeight: 500,
});

const HiddenLink = styled('input')({
  display: 'none',
});
