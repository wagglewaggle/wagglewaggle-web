import { useState, ChangeEvent } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import { pageType } from 'types/typeBundle';

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
      color: '#000',
    },
  },
}));

interface propsType {
  handleCurrentPageChange: (newPage: pageType) => void;
}

const SearchInput = (props: propsType) => {
  const { handleCurrentPageChange } = props;
  const [value, setValue] = useState<string>('');
  const classes = useStyles();

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={classes.wrap}>
      <TextField
        className={classes.input}
        type='text'
        value={value}
        onChange={handleChangeValue}
        onFocus={() => handleCurrentPageChange('search')}
        placeholder='Search'
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
