import { ChangeEvent, KeyboardEvent } from 'react';
import { Box, TextField, IconButton, InputAdornment, Icon } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { pageType } from 'types/typeBundle';
import { palette } from 'constants/palette';
import logo from 'assets/temp-logo.png';
import leftArrowIcon from 'assets/icons/left-icon.svg';
import searchIcon from 'assets/icons/search-icon.svg';

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
  currentPage: pageType;
  searchValue: string;
  handleSearchValueChange: (newValue: string) => void;
  handleCurrentPageChange: (newPage: pageType) => void;
}

const SearchInput = (props: propsType) => {
  const { currentPage, searchValue, handleSearchValueChange, handleCurrentPageChange } = props;
  const classes = useStyles();

  const handleArrowLeftClick = () => {
    handleSearchValueChange('');
    handleCurrentPageChange('main');
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchValueChange(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchValue.length === 0) {
      handleCurrentPageChange('search');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCurrentPageChange('result');
    }
  };

  return (
    <Box
      className={classes.wrap}
      sx={{ borderBottom: currentPage !== 'main' ? `1px solid ${palette.grey[600]}` : '' }}
    >
      {currentPage !== 'main' && (
        <IconButton onClick={handleArrowLeftClick} sx={{ padding: 0 }}>
          <img src={leftArrowIcon} alt='left-arrow' />
        </IconButton>
      )}
      {currentPage === 'main' && <img className={classes.logo} src={logo} alt='logo' />}
      <TextField
        className={classes.input}
        type='text'
        value={searchValue}
        onChange={handleValueChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={currentPage === 'main' ? '' : "'여의도'를 검색해보세요"}
        InputProps={{
          endAdornment: currentPage === 'main' && (
            <InputAdornment position='start'>
              <Icon
                sx={{ width: '32px', height: '32px', '& img': { width: '32px', height: '32px' } }}
              >
                <img src={searchIcon} alt='search' />
              </Icon>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchInput;
