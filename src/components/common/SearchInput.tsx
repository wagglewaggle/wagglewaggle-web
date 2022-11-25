import { ChangeEvent } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import { pageType } from 'types/typeBundle';
import leftArrowIcon from 'assets/left-arrow.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    justifyContent: 'center',
    padding: 20,
    width: 'calc(100% - 40px)',
  },
  input: {
    display: 'flex',
    borderRadius: 25,
    width: '100%',
    height: 48,
    backgroundColor: '#d9d9d9',
    filter: 'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25))',
    '& input': {
      padding: '12.5px 14px 12.5px 0',
    },
    '& fieldset': {
      display: 'none',
    },
    '& svg': {
      width: 29,
      height: 29,
      color: '#000',
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
    handleCurrentPageChange('main');
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchValueChange(e.target.value);
  };

  const handleInputFocus = () => {
    handleCurrentPageChange(searchValue.length === 0 ? 'search' : 'suggestion');
  };

  return (
    <div className={classes.wrap}>
      {currentPage === 'search' && (
        <IconButton
          onClick={handleArrowLeftClick}
          sx={{
            padding: 0,
            marginRight: '24px',
          }}
        >
          <img src={leftArrowIcon} alt='left-arrow' />
        </IconButton>
      )}
      <TextField
        className={classes.input}
        type='text'
        value={searchValue}
        onChange={handleValueChange}
        onFocus={handleInputFocus}
        placeholder={currentPage === 'main' ? 'Search' : '검색어를 입력하세요.'}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchInput;
