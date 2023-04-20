import { useRef } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { palette } from 'constants/';
import { handleShareLinkClick } from 'util/';
import { useStore } from 'stores';

const Footer = observer(() => {
  const copyLinkRef = useRef<HTMLInputElement>(null);
  const { ThemeStore, UserNavigatorStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleContactUsClick = () => {
    window.open('https://forms.gle/AcsYE7WzCkQQwisP7', '_blank');
  };

  const handleShareClick = () => {
    UserNavigatorStore.setLinkPopupTarget('링크');
    handleShareLinkClick(copyLinkRef?.current);
  };

  return (
    <Wrap>
      <Buttons isDarkTheme={isDarkTheme}>
        <button onClick={handleContactUsClick}>Contact Us</button>|
        <button onClick={handleShareClick}>Share Link</button>
      </Buttons>
      <TeamName>© 2023 Team EXIT</TeamName>
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
