import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import { CustomChips } from 'components/common';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import { FavoritePlaceType } from 'types/typeBundle';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';
import { ReactComponent as PersonIcon } from 'assets/icons/person-icon.svg';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';

interface PropsType {
  navigateToHome?: () => void;
  handleSearchClick?: () => void;
  isFixed?: boolean;
}

const LeftButton = (props: { backUrlInfo?: string }) => {
  const { backUrlInfo } = props;
  const navigate = useNavigate();
  const { ReviewStore } = useStore().MobxStore;

  const handleRefresh = () => {
    if (!backUrlInfo) return;
    navigate(backUrlInfo);
    ReviewStore.initReviewDetail();
  };

  return (
    <CustomIconButton onClick={handleRefresh}>
      <LeftIcon />
    </CustomIconButton>
  );
};

const CustomHeader = (props: PropsType) => {
  const { navigateToHome, handleSearchClick, isFixed } = props;
  const {
    ThemeStore,
    CustomDrawerStore,
    CategoryStore,
    LocationStore,
    AuthStore,
    ScreenSizeStore,
    ReviewStore,
  } = useStore().MobxStore;
  const { pathname, search } = useLocation();
  const { locationData } = LocationStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isExpanded = ['expanded', 'full'].includes(CustomDrawerStore.drawerStatus.expanded);
  const isReviewPage = pathname.split('/').includes('review');
  const placeName = locationNames[locationData?.name ?? ''] || (locationData?.name ?? '');
  const pathnameArr = pathname.split('/');
  const placeIdx = Number(pathnameArr[2]);
  const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(
    locationNames[placeName] || placeName
  )
    ? 'SKT'
    : 'KT';

  const handleClickChip = (chip: string) => {
    CategoryStore.setSelectedCategory(chip);
  };

  const handleHeartClick = async () => {
    const pathnameArr = pathname.split('/');
    const placeIdx = Number(pathnameArr[pathnameArr.length - 1]);
    const requestParams = { idx: placeIdx, type: requestType };
    const pinned = LocationStore.currentLocationPinned;
    pinned
      ? await axiosRequest('delete', 'pin-place', requestParams)
      : await axiosRequest('post', 'pin-place', requestParams);
    LocationStore.handlePinChange(pinned);
  };

  useEffect(() => {
    if (isReviewPage || !locationData?.name) return;
    LocationStore.setCurrentLocationPinned(
      AuthStore.favorites.places
        .map((favorite: FavoritePlaceType) => favorite.place.name)
        .includes(locationData.name)
    );
  }, [isReviewPage, search, locationData?.name, requestType, LocationStore, AuthStore.favorites]);

  return (
    <Wrap
      isFixed={isFixed}
      screenWidth={ScreenSizeStore.screenWidth}
      isDarkTheme={isDarkTheme}
      height={isReviewPage || isExpanded ? 48 : 104}
    >
      <HeaderWrap>
        <SubHeaderWrap>
          {!navigateToHome ? (
            <SubHeader>
              <LeftButton
                backUrlInfo={
                  ReviewStore.reviewDetail
                    ? `/review/${placeIdx}?name=${placeName}`
                    : `/map/${placeIdx}${search}`
                }
              />
              {`${placeName} 실시간 리뷰`}
            </SubHeader>
          ) : !isExpanded ? (
            <>
              <Logo onClick={navigateToHome} />
              <SubHeader>
                <CustomIconButton onClick={handleSearchClick}>
                  <SearchIcon />
                </CustomIconButton>
                <CustomIconButton>
                  <PersonIcon />
                </CustomIconButton>
              </SubHeader>
            </>
          ) : (
            <>
              <SubHeader>
                <LeftButton />
                {placeName}
              </SubHeader>
              <CustomIconButton
                pinned={LocationStore.currentLocationPinned}
                onClick={handleHeartClick}
              >
                <HeartIcon />
              </CustomIconButton>
            </>
          )}
        </SubHeaderWrap>
      </HeaderWrap>
      {!isReviewPage && !isExpanded && (
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
  shouldForwardProp: (prop: string) =>
    !['isFixed', 'screenWidth', 'isDarkTheme', 'height'].includes(prop),
})<{ isFixed?: boolean; screenWidth: number; isDarkTheme: boolean; height: number }>(
  ({ isFixed, screenWidth, isDarkTheme, height }) => ({
    position: isFixed ? 'fixed' : undefined,
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

const SubHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  gap: 8,
});

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'pinned',
})<{ pinned?: boolean }>(({ pinned }) => ({
  padding: 0,
  width: 24,
  height: 24,
  '& svg': {
    width: 24,
    height: 24,
  },
  '& path': {
    fill: pinned === true ? palette.violet : pinned === false ? palette.grey[400] : palette.black,
  },
}));

const ChipsWrap = styled('div')({
  padding: '0 24px',
  width: 'calc(100% - 40px)',
  transform: 'translateX(-4px)',
});
