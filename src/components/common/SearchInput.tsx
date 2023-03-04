import { ChangeEvent, KeyboardEvent, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { TextField, IconButton, styled } from '@mui/material';
import CustomCloseIcon from './CustomCloseIcon';
import SearchData from 'components/view/list/SearchData';
import SuggestData from 'components/view/list/SuggestData';
import ResultData from 'components/view/list/ResultData';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ReactComponent as LeftArrowIcon } from 'assets/icons/left-icon.svg';

const SearchInput = observer(() => {
  const navigate = useNavigate();
  const { ThemeStore, CustomDrawerStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleArrowLeftClick = () => {
    navigate(`/${CustomDrawerStore.variant}`);
    CustomDrawerStore.closeDrawer();
  };

  const handleLatestListChange = (newList: string[]) => {
    localStorage.setItem('@wagglewaggle_recently_searched', JSON.stringify(newList));
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    CustomDrawerStore.setSearchValue(newValue);
    CustomDrawerStore.openDrawer(
      CustomDrawerStore.variant,
      newValue.length === 0 ? (
        <SearchData
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
        />
      ) : (
        <SuggestData
          placeData={CustomDrawerStore.placeData}
          searchValue={newValue}
          handleWordClick={handleWordClick}
          handleLatestListChange={handleLatestListChange}
        />
      )
    );
  };

  const handleWordClick = (searchWord: string) => {
    CustomDrawerStore.setSearchValue(searchWord);
    CustomDrawerStore.openDrawer(
      'list',
      <ResultData placeData={CustomDrawerStore.placeData} searchWord={searchWord} />
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (CustomDrawerStore.searchValue && e.key === 'Enter') {
      handleWordClick(CustomDrawerStore.searchValue);
    }
  };

  const handleIconClick = useCallback(() => {
    CustomDrawerStore.setSearchValue('');
  }, [CustomDrawerStore]);

  useEffect(() => {
    handleIconClick();
  }, [handleIconClick]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CustomIconButton isDarkTheme={isDarkTheme} onClick={handleArrowLeftClick}>
        <CustomLeftArrowIcon />
      </CustomIconButton>
      <CustomTextField
        isDarkTheme={isDarkTheme}
        type='text'
        autoFocus
        value={CustomDrawerStore.searchValue}
        onChange={handleValueChange}
        onKeyDown={handleKeyDown}
        placeholder="'강남역'를 입력해보세요"
      />
      {CustomDrawerStore.searchValue.length > 0 && (
        <CustomCloseIcon handleIconClick={handleIconClick} />
      )}
    </Wrap>
  );
});

export default SearchInput;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottom: `1px solid ${palette.grey[isDarkTheme ? 600 : 300]}`,
  padding: '12px 24px',
  width: 'calc(100% - 48px)',
  height: 32,
}));

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  padding: 0,
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
}));

const CustomLeftArrowIcon = styled(LeftArrowIcon)({
  '& path': {
    width: 12.16,
    height: 20.55,
  },
});

const CustomTextField = styled(TextField, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
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
  '& ::placeholder': {
    color: palette.grey[isDarkTheme ? 400 : 500],
  },
}));
