import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { CustomChips } from 'components/common';
import { MapHeader } from './HeaderContents';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { FavoritePlaceType, RequestType } from 'types/typeBundle';

interface PropsType {
  navigateToHome?: () => void;
  handleSearchClick?: () => void;
}

const CustomHeader = (props: PropsType) => {
  const { navigateToHome, handleSearchClick } = props;
  const {
    ThemeStore,
    CustomDrawerStore,
    CategoryStore,
    LocationStore,
    AuthStore,
    ScreenSizeStore,
  } = useStore().MobxStore;
  const [searchParams] = useSearchParams();
  const { locationData, placesData } = LocationStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isExpanded = ['expanded', 'full'].includes(CustomDrawerStore.drawerStatus.expanded);
  const placeName = searchParams.get('name') ?? '';
  const requestType: RequestType | undefined = placesData.find(
    (data) => data.name === placeName
  )?.type;

  const handleClickChip = (chip: string) => {
    CategoryStore.setSelectedCategory(chip);
  };

  useEffect(() => {
    if (!locationData?.name) return;
    LocationStore.setCurrentLocationPinned(
      AuthStore.favorites.places
        .map((favorite: FavoritePlaceType) => favorite.place.name)
        .includes(locationData.name)
    );
  }, [locationData?.name, LocationStore, AuthStore.favorites]);

  return (
    <Wrap
      screenWidth={ScreenSizeStore.screenWidth}
      isDarkTheme={isDarkTheme}
      height={isExpanded ? 48 : 104}
    >
      <HeaderWrap>
        <SubHeaderWrap>
          <MapHeader
            isExpanded={isExpanded}
            requestType={requestType}
            placeName={placeName}
            navigateToHome={navigateToHome}
            handleSearchClick={handleSearchClick}
          />
        </SubHeaderWrap>
      </HeaderWrap>
      {!isExpanded && (
        <ChipsWrap>
          <CustomChips handleClickChip={handleClickChip} />
        </ChipsWrap>
      )}
    </Wrap>
  );
};

export default observer(CustomHeader);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) =>
    !['isFixed', 'screenWidth', 'isDarkTheme', 'height'].includes(prop),
})<{ screenWidth: number; isDarkTheme: boolean; height: number }>(
  ({ screenWidth, isDarkTheme, height }) => ({
    position: 'fixed',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${palette.grey[300]}`,
    width: screenWidth,
    height,
    backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
    zIndex: 20,
    '& svg': {
      cursor: 'pointer',
    },
  })
);

const HeaderWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  height: 48,
});

const SubHeaderWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const ChipsWrap = styled('div')({
  padding: '0 24px',
  width: 'calc(100% - 40px)',
  transform: 'translateX(-4px)',
});
