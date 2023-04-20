import { useRef } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { PlaceStatus } from 'components/common';
import { useStore } from 'stores';
import { palette, locationNames } from 'constants/';
import { handleShareLinkClick } from 'util/';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import { ReactComponent as CctvIcon } from 'assets/icons/drawer/cctv.svg';
import { ReactComponent as ShareIcon } from 'assets/icons/drawer/share.svg';
import { ReactComponent as NaviIcon } from 'assets/icons/drawer/navi.svg';
import { CategoryType } from 'types/typeBundle';

const CongestionSummary = () => {
  const copyLinkRef = useRef<HTMLInputElement>(null);
  const { ThemeStore, LocationStore, CustomDrawerStore, UserNavigatorStore } = useStore().MobxStore;
  const { placeName, categories, locationData } = LocationStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const isAppeared = CustomDrawerStore.drawerStatus.expanded === 'appeared';
  const searchName = locationNames[placeName ?? ''] ?? placeName ?? '';

  const handleNaviClick = () => {
    CustomDrawerStore.setMapNavigationOpen(true);
  };

  const handleShareClick = () => {
    UserNavigatorStore.setLinkPopupTarget('링크');
    handleShareLinkClick(copyLinkRef.current);
  };

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
          <Title isAppeared={isAppeared}>{searchName}</Title>
          <Type>
            {(categories?.[placeName ?? ''] ?? [])
              .map((category: CategoryType) => category.type)
              .sort()
              .join(', ')}
          </Type>
        </LocationWrap>
        {isAppeared && (
          <StatusWrap>
            <PlaceStatus status={locationData?.population?.level} />
          </StatusWrap>
        )}
      </Header>
      <IconsWrap>
        <IconWrap isPinned={LocationStore.currentLocationPinned} isAppeared={isAppeared}>
          <HeartIcon /> {String(locationData?.pinPlaceCount ?? 0).padStart(2, '0')}
        </IconWrap>
        <IconWrap isAppeared={isAppeared}>
          <ChatIcon /> {String(locationData?.reviewPostCount ?? 0).padStart(2, '0')}
        </IconWrap>
        <IconWrap isAppeared={isAppeared}>
          <CctvIcon /> {String(locationData?.cctvs?.length ?? 0).padStart(2, '0')}
        </IconWrap>
      </IconsWrap>
      <Address isAppeared={isAppeared}>{locationData?.address ?? ''}</Address>
      <ButtonsWrap>
        <CustomButton variant='share' onClick={handleShareClick}>
          <ShareIcon />
          공유하기
        </CustomButton>
        <CustomButton variant='navi' onClick={handleNaviClick}>
          <NaviIcon />
          길찾기
        </CustomButton>
      </ButtonsWrap>
      <HiddenLink ref={copyLinkRef} value={window.location.href} onChange={() => {}} />
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
    padding: '12px 24px 24px',
    width: 'calc(100% - 48px)',
    height: (isAppeared ? 204 : 180) + (isFull ? 8 : 0),
    backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
    gap: 8,
  })
);

const BlankArea = styled('div', {
  shouldForwardProp: (prop: string) => !['isFull', 'isDarkTheme'].includes(prop),
})<{ isFull: boolean; isDarkTheme: boolean }>(({ isFull, isDarkTheme }) => ({
  width: '100%',
  height: isFull ? 40 : 20,
  minHeight: isFull ? 40 : 20,
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
  gap: 8,
});

const Title = styled('span', {
  shouldForwardProp: (prop: string) => prop !== 'isAppeared',
})<{ isAppeared: boolean }>(({ isAppeared }) => ({
  color: palette.black,
  fontSize: isAppeared ? 18 : 24,
  fontWeight: 600,
  lineHeight: '24px',
}));

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
  shouldForwardProp: (prop: string) => !['isPinned', 'isAppeared'].includes(prop),
})<{ isPinned?: boolean; isAppeared: boolean }>(({ isPinned, isAppeared }) => ({
  display: 'flex',
  alignItems: 'center',
  color: palette.grey[400],
  fontSize: isAppeared ? 12 : 14,
  fontWeight: isAppeared ? 500 : 600,
  lineHeight: isAppeared ? '16px' : '20px',
  gap: 2,
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));

const Address = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isAppeared',
})<{ isAppeared: boolean }>(({ isAppeared }) => ({
  marginBottom: isAppeared ? 0 : 8,
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
}));

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
  minWidth: 157.5,
  width: 'inherit',
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

const HiddenLink = styled('input')({
  display: 'none',
});
