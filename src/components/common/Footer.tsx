import { useState, useRef } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { palette } from 'constants/';
import { LinkCopyPopup } from './styledComponents';
import { handleShareLinkClick } from 'util/';
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

  return (
    <Wrap>
      <Buttons isDarkTheme={isDarkTheme}>
        <button onClick={handleContactUsClick}>Contact Us</button>|
        <button onClick={() => handleShareLinkClick(copyLinkRef?.current, setLinkCopied)}>
          Share Link
        </button>
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
  marginBottom: 8,
  width: 191,
  '& button': {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: isDarkTheme ? palette.white : palette.black,
  },
}));

const TeamName = styled('div')({
  marginTop: 8,
  height: 44,
  color: palette.grey[500],
  fontSize: 12,
  fontWeight: 500,
});

const HiddenLink = styled('input')({
  display: 'none',
});
