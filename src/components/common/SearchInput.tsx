import { ChangeEvent, KeyboardEvent } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/';
import leftArrowIcon from 'assets/icons/left-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 24px',
    width: 'calc(100% - 48px)',
    height: 32,
  },
  logo: {
    width: 56,
    height: 32,
  },
  input: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 25,
    width: '100%',
    height: 48,
    '& input': {
      padding: '12.5px 0 12.5px 14px',
      color: palette.white,
      fontSize: 14,
      fontWeight: 400,
    },
    '& fieldset': {
      display: 'none',
    },
    '& svg': {
      width: 29,
      height: 29,
      color: palette.white,
    },
  },
}));

interface propsType {
  searchValue: string;
  handleSearchEnter: (searchWord: string) => void;
  handleDrawerClose: () => void;
  handleSearchValueChange: (newValue: string) => void;
}

const SearchInput = (props: propsType) => {
  const { searchValue, handleSearchEnter, handleDrawerClose, handleSearchValueChange } = props;
  const classes = useStyles();

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

  return (
    <Box className={classes.wrap}>
      <IconButton onClick={handleArrowLeftClick} sx={{ padding: 0 }}>
        <img src={leftArrowIcon} alt='left-arrow' />
      </IconButton>
      <TextField
        className={classes.input}
        type='text'
        value={searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="'강남역'를 입력해보세요"
      />
    </Box>
  );
};

export default SearchInput;
