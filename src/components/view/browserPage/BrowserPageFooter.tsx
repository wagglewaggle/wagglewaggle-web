import { useState, useRef } from 'react';
import { styled } from '@mui/material';
import { LinkCopyPopup } from 'components/common';
import { useStore } from 'stores';
import { handleShareLinkClick } from 'util/';
import { palette } from 'constants/';
import linkCheckIcon from 'assets/icons/link-check-icon.svg';

const BrowserPageFooter = () => {
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const copyLinkRef = useRef<HTMLInputElement>(null);
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';

  const handleContactUsClick = () => {
    window.open('https://forms.gle/AcsYE7WzCkQQwisP7', '_blank');
  };

  return (
    <Wrap>
      <Buttons>
        <button onClick={handleContactUsClick}>Contact Us</button>
        <button>|</button>
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
        <TeamName>© 2023 Team EXIT</TeamName>
      )}
      <HiddenLink ref={copyLinkRef} value={window.location.href} onChange={() => {}} />
    </Wrap>
  );
};

export default BrowserPageFooter;

const Wrap = styled('div')({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '28px 0',
  width: '100%',
  backgroundColor: palette.grey[100],
  gap: 16,
});

const Buttons = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  '& button': {
    border: 'none',
    width: 'fit-content',
    backgroundColor: 'transparent',
    color: palette.black,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
    cursor: 'pointer',
  },
  '& button:nth-of-type(2)': {
    cursor: 'initial',
  },
});

const TeamName = styled('div')({
  color: palette.grey[500],
  fontSize: 12,
  fontWeight: 500,
});

const HiddenLink = styled('input')({
  display: 'none',
});
