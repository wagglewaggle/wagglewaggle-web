import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import { CustomChips } from 'components/common';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import { FavoritePlaceType, FavoritesType } from 'types/typeBundle';
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
  const { CustomDrawerStore, CategoryStore, LocationStore, AuthStore } = useStore().MobxStore;
  const { pathname, search } = useLocation();
  const { locationData } = LocationStore;
  const isExpanded = ['expanded', 'full'].includes(CustomDrawerStore.drawerStatus.expanded);
  const placeName = locationNames[locationData?.name ?? ''] || (locationData?.name ?? '');
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
    const response = LocationStore.currentLocationPinned
      ? await axiosRequest('delete', 'pin-place', { idx: placeIdx })
      : await axiosRequest('post', 'pin-place', { idx: placeIdx, type: requestType });
    if (!response?.data) return;
    const { data } = (await axiosRequest('get', 'pin-place')) as { data: FavoritesType };
    AuthStore.setFavorites(data);
  };

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    const placeIdx = Number(pathnameArr[pathnameArr.length - 1]);
    LocationStore.setCurrentLocationPinned(
      AuthStore.favorites[`${requestType.toLowerCase() as 'kt' | 'skt'}Places`]
        .map((favorite: FavoritePlaceType) => favorite.place.idx)
        .includes(placeIdx)
    );
  }, [search, pathname, requestType, LocationStore, AuthStore.favorites]);

  return (
    <Wrap height={isExpanded ? 48 : 104}>
      <HeaderWrap>
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
              {placeName}
            </SubHeader>
            <CustomIconButton
              pinned={LocationStore.currentLocationPinned}
              onClick={handleHeartClick}
            >
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
