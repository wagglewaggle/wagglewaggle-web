import { styled } from '@mui/material';
import { useStore } from 'stores';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';
import { palette } from 'constants/';

interface PropsType {
  navigateToHome: () => void;
  handleSearchClick: () => void;
}

const CustomSearchBox = (props: PropsType) => {
  const { navigateToHome, handleSearchClick } = props;
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  return (
    <SearchBox isDarkTheme={isDarkTheme}>
      <Logo onClick={navigateToHome} />
      <EmptySpace />
      <SearchIcon onClick={handleSearchClick} />
    </SearchBox>
  );
};

export default CustomSearchBox;

const SearchBox = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: 56,
  '& svg': {
    width: 66,
    height: 32,
    cursor: 'pointer',
  },
  '& svg:last-of-type': {
    width: 32,
    height: 32,
  },
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
}));

const EmptySpace = styled('div')({
  flexGrow: 1,
  height: '100%',
});
