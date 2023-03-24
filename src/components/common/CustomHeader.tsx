import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { CustomChips } from 'components/common';
import { ReplyHeader, MapHeader } from './HeaderContents';
import { useStore } from 'stores';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import { FavoritePlaceType } from 'types/typeBundle';

interface PropsType {
  isReplyPage?: boolean;
  navigateToHome?: () => void;
  handleSearchClick?: () => void;
}

const CustomHeader = (props: PropsType) => {
  const { isReplyPage, navigateToHome, handleSearchClick } = props;
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
  const [searchParams] = useSearchParams();
  const { locationData } = LocationStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isExpanded = ['expanded', 'full'].includes(CustomDrawerStore.drawerStatus.expanded);
  const isReviewPage = pathname.split('/').includes('review');
  const placeName = searchParams.get('name') ?? '';
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
      screenWidth={ScreenSizeStore.screenWidth}
      isDarkTheme={isDarkTheme}
      height={isReviewPage || isExpanded ? 48 : 104}
    >
      <HeaderWrap>
        <SubHeaderWrap>
          {!navigateToHome ? (
            <ReplyHeader
              isReplyPage={isReplyPage}
              placeIdx={placeIdx}
              placeName={placeName}
              search={search}
              isMyReview={
                sessionStorage.getItem('@wagglewaggle_user_nickname') ===
                ReviewStore.reviewDetail?.writer.nickname
              }
            />
          ) : (
            <MapHeader
              isExpanded={isExpanded}
              requestType={requestType}
              placeName={placeName}
              navigateToHome={navigateToHome}
              handleSearchClick={handleSearchClick}
            />
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
})<{ screenWidth: number; isDarkTheme: boolean; height: number }>(
  ({ screenWidth, isDarkTheme, height }) => ({
    position: 'fixed',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${palette.grey[300]}`,
    width: screenWidth,
    maxWidth: 430,
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
