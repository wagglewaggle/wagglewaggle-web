import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import { CustomChips } from 'components/common';
import { useStore } from 'stores';
import { palette, locationNames } from 'constants/';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';
import { ReactComponent as PersonIcon } from 'assets/icons/person-icon.svg';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';

interface PropsType {
  navigateToHome: () => void;
  handleSearchClick: () => void;
}

const CustomHeader = (props: PropsType) => {
  const { navigateToHome, handleSearchClick } = props;
  const { ThemeStore, CustomDrawerStore, CategoryStore, LocationStore } = useStore().MobxStore;
  const { locationData } = LocationStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const isExpanded = ['expanded', 'full'].includes(CustomDrawerStore.drawerStatus.expanded);

  const handleClickChip = (chip: string) => {
    CategoryStore.setSelectedCategory(chip);
  };

  return (
    <Wrap height={isExpanded ? 48 : 104}>
      <HeaderWrap isDarkTheme={isDarkTheme}>
        {!isExpanded ? (
          <SubHeaderWrap>
            <Logo onClick={navigateToHome} />
            <SubHeader>
              <CustomIconButton onClick={handleSearchClick}>
                <SearchIcon />
              </CustomIconButton>
              <CustomIconButton>
                <PersonIcon />
              </CustomIconButton>
            </SubHeader>
          </SubHeaderWrap>
        ) : (
          <SubHeaderWrap>
            <SubHeader>
              <CustomIconButton>
                <LeftIcon />
              </CustomIconButton>

              <div>{locationNames[locationData?.name ?? ''] || (locationData?.name ?? '')}</div>
            </SubHeader>
            <CustomIconButton>
              <HeartIcon />
            </CustomIconButton>
          </SubHeaderWrap>
        )}
      </HeaderWrap>
      {!isExpanded && (
        <ChipsWrap>
          <CustomChips
            selectedCategory={CategoryStore.selectedCategory}
            handleClickChip={handleClickChip}
          />
        </ChipsWrap>
      )}
    </Wrap>
  );
};

export default observer(CustomHeader);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'height',
})<{ height: number }>(({ height }) => ({
  display: 'flex',
  flexDirection: 'column',
  height,
  '& svg': {
    cursor: 'pointer',
  },
}));

const HeaderWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: 48,
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
}));

const SubHeaderWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const SubHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  gap: 8,
});

const CustomIconButton = styled(IconButton)({
  padding: 0,
  width: 24,
  height: 24,
  '& svg': {
    width: 24,
    height: 24,
  },
});

const ChipsWrap = styled('div')({
  padding: '0 24px',
  width: 'calc(100% - 40px)',
  transform: 'translateX(-4px)',
});
