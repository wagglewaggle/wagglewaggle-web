import { ChangeEvent, KeyboardEvent } from 'react';
import { observer } from 'mobx-react';
import { Box, TextField, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CustomCloseIcon from './CustomCloseIcon';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ReactComponent as LeftArrowIcon } from 'assets/icons/left-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 24px',
    width: 'calc(100% - 48px)',
    height: 32,
  },
  leftIcon: {
    '& path': {
      width: 12.16,
      height: 20.55,
    },
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 25,
    width: '100%',
    height: 48,
    '& input': {
      padding: '12.5px 0 12.5px 14px',
      fontSize: 14,
      fontWeight: 400,
    },
    '& input::placeholder': {
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '20px',
      opacity: 1,
    },
    '& fieldset': {
      display: 'none',
    },
  },
}));

interface propsType {
  searchValue: string;
  handleSearchEnter: (searchWord: string) => void;
  handleDrawerClose: () => void;
  handleSearchValueChange: (newValue: string) => void;
}

const SearchInput = observer((props: propsType) => {
  const { searchValue, handleSearchEnter, handleDrawerClose, handleSearchValueChange } = props;
  const classes = useStyles();
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleArrowLeftClick = () => {
    handleDrawerClose();
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchValueChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (searchValue !== '' && e.key === 'Enter') {
      handleSearchEnter(searchValue);
    }
  };

  const handleIconClick = () => {
    handleSearchValueChange('');
  };

  return (
    <Box
      className={classes.wrap}
      sx={{
        borderBottom: `1px solid ${palette.grey[isDarkTheme ? 600 : 300]}`,
      }}
    >
      <IconButton
        onClick={handleArrowLeftClick}
        sx={{
          padding: 0,
          '& path': {
            fill: isDarkTheme ? palette.white : palette.black,
          },
        }}
      >
        <LeftArrowIcon className={classes.leftIcon} />
      </IconButton>
      <TextField
        className={classes.input}
        type='text'
        autoFocus
        value={searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="'강남역'를 입력해보세요"
        sx={{
          '& ::placeholder': {
            color: palette.grey[isDarkTheme ? 400 : 500],
          },
        }}
      />
      {searchValue.length > 0 && <CustomCloseIcon handleIconClick={handleIconClick} />}
    </Box>
  );
});

export default SearchInput;
