import { useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceStatus } from 'components/common';
import { useStore } from 'stores';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import { FavoritePlaceType } from 'types/typeBundle';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import { ReactComponent as CctvIcon } from 'assets/icons/drawer/cctv.svg';
import { ReactComponent as ShareIcon } from 'assets/icons/drawer/share.svg';
import { ReactComponent as NaviIcon } from 'assets/icons/drawer/navi.svg';

const CongestionSummary = () => {
  const { ThemeStore, LocationStore, CustomDrawerStore, AuthStore } = useStore().MobxStore;
  const { placeName, categories, locationData } = LocationStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isAppeared = CustomDrawerStore.drawerStatus.expanded === 'appeared';
  const requestType: string = locationRequestTypes.skt.includes(
    locationNames?.[placeName as string] || (placeName as string)
  )
    ? 'SKT'
    : 'KT';
  const isPinned = AuthStore.favorites[
    `${requestType.toLowerCase()}Places` as 'ktPlaces' | 'sktPlaces'
  ]
    .map((favorite: FavoritePlaceType) => favorite.place.name)
    .includes(placeName as string);

  const handleShareClick = useCallback(() => {
    CustomDrawerStore.setRndResizerFunctionConfig('share');
  }, [CustomDrawerStore]);

  const handleNaviClick = useCallback(() => {
    CustomDrawerStore.setRndResizerFunctionConfig('navi');
  }, [CustomDrawerStore]);

  return (
    <Wrap
      isFull={CustomDrawerStore.drawerStatus.expanded === 'full'}
      isDarkTheme={isDarkTheme}
      isAppeared={isAppeared}
    >
      {!isAppeared && (
        <BlankArea
          isFull={CustomDrawerStore.drawerStatus.expanded === 'full'}
          isDarkTheme={isDarkTheme}
        />
      )}
      <Header>
        <LocationWrap>
          <Title>{locationNames?.[placeName ?? ''] ?? placeName}</Title>
          <Type>{categories?.[placeName ?? '']?.[0]?.type ?? ''}</Type>
        </LocationWrap>
        <StatusWrap>
          <PlaceStatus status={locationData?.population.level} />
        </StatusWrap>
      </Header>
      <IconsWrap>
        <IconWrap isPinned={isPinned}>
          <HeartIcon /> {String(locationData?.pinPlaceCount ?? 0).padStart(2, '0')}
        </IconWrap>
        <IconWrap>
          <ChatIcon /> {String(locationData?.reviewPostCount ?? 0).padStart(2, '0')}
        </IconWrap>
        <IconWrap>
          <CctvIcon /> {String(locationData?.cctvs?.length ?? 0).padStart(2, '0')}
        </IconWrap>
      </IconsWrap>
      <Address>{locationData?.address ?? ''}</Address>
      <ButtonsWrap>
        <CustomButton variant='share' onMouseDown={handleShareClick} onTouchEnd={handleShareClick}>
          <ShareIcon />
          공유하기
        </CustomButton>
        <CustomButton variant='navi' onMouseDown={handleNaviClick} onTouchEnd={handleNaviClick}>
          <NaviIcon />
          길찾기
        </CustomButton>
      </ButtonsWrap>
    </Wrap>
  );
};

export default observer(CongestionSummary);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isFull', 'isDarkTheme', 'isAppeared'].includes(prop),
})<{ isFull: boolean; isDarkTheme: boolean; isAppeared: boolean }>(
  ({ isFull, isDarkTheme, isAppeared }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 24px 16px',
    width: 'calc(100% - 48px)',
    height: (isAppeared ? 204 : 172) + (isFull ? 8 : 0),
    backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
    gap: 8,
  })
);

const BlankArea = styled('div', {
  shouldForwardProp: (prop: string) => !['isFull', 'isDarkTheme'].includes(prop),
})<{ isFull: boolean; isDarkTheme: boolean }>(({ isFull, isDarkTheme }) => ({
  width: '100%',
  height: isFull ? 40 : 32,
  minHeight: isFull ? 40 : 32,
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
}));

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: 24,
});

const LocationWrap = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  width: '100%',
  height: '100%',
  gap: 4,
});

const Title = styled('span')({
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const Type = styled('span')({
  color: palette.grey[500],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
});

const StatusWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  minWidth: 'fit-content',
  fontSize: 14,
  fontWeight: 600,
});

const IconsWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const IconWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isPinned',
})<{ isPinned?: boolean }>(({ isPinned }) => ({
  display: 'flex',
  color: palette.grey[400],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));

const Address = styled('div')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});

const ButtonsWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: 8,
  width: '100%',
  gap: 12,
});

const CustomButton = styled('button', {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ variant: 'share' | 'navi' }>(({ variant }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${palette.black}`,
  borderRadius: 4,
  width: 157.5,
  height: 36,
  color: variant === 'share' ? palette.black : palette.white,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  backgroundColor: variant === 'share' ? palette.white : palette.black,
  gap: 4,
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9,
  },
}));
