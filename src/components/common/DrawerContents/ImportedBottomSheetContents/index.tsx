import { useRef } from 'react';
import { isIOS, isAndroid } from 'react-device-detect';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import { useStore } from 'stores';
import { handleShareLinkClick } from 'util/';
import { palette, locationNames } from 'constants/';
import kakaoMapLogo from 'assets/icons/drawer/kakao-map-logo.png';
import naverMapLogo from 'assets/icons/drawer/naver-map-logo.png';
import tMapLogo from 'assets/icons/drawer/t-map-logo.png';
import builtInMapLogo from 'assets/icons/drawer/built-in-map-logo.png';
import copyLogo from 'assets/icons/drawer/copy-logo.png';

type ListType = {
  title: string;
  logo: string;
  action: () => void;
};

const ImportedBottomSheet = () => {
  const copyAddrRef = useRef<HTMLInputElement>(null);
  const { CustomDrawerStore, LocationStore, UserNavigatorStore } = useStore().MobxStore;
  const { placeName, locationData } = LocationStore;
  const searchName = locationNames[placeName ?? ''] ?? placeName ?? '';

  const handleKakaoMapClick = () => {
    if (!locationData?.x || !locationData?.y) return;
    window.open(
      `https://map.kakao.com/link/to/${searchName},${locationData.x},${locationData.y}`,
      '_blank'
    );
    handleClose();
  };

  const handleNaverMapClick = () => {
    if (!locationData?.x || !locationData?.y) return;
    window.open(
      `nmap://route/public?dname=${searchName}&dlat=${locationData.x}&dlng=${locationData.y}&appname=com.exit.wagglewaggle`,
      '_blank'
    );
    handleClose();
  };

  const handleTMapClick = () => {
    if (!locationData?.x || !locationData?.y) return;
    window.open(
      // `tmap://?rGoName=${searchName}&rGoX=${locationData.x}&rGoY=${locationData.y}`,
      `tmap://search?name=${searchName}`,
      '_blank'
    );
    handleClose();
  };

  const handleBuiltInMapClick = () => {
    if (isIOS && !locationData?.address) return;
    if (isAndroid && (!locationData?.x || !locationData?.y)) return;
    const navigateUrl = isIOS
      ? `http://maps.apple.com?daddr=${locationData?.address}`
      : `https://www.google.com/maps/dir/?api=1&destination=${locationData?.x}%2C${locationData?.y}`;
    window.open(navigateUrl, '_blank');
    handleClose();
  };

  const handleCopyAddrClick = () => {
    if (!locationData?.address) return;
    UserNavigatorStore.setLinkPopupTarget('주소');
    handleShareLinkClick(copyAddrRef.current);
    handleClose();
  };

  const handleClose = () => {
    CustomDrawerStore.setMapNavigationOpen(false);
  };

  const NAVI_LIST: ListType[] = [
    { title: '카카오맵', logo: kakaoMapLogo, action: handleKakaoMapClick },
    { title: '네이버 지도', logo: naverMapLogo, action: handleNaverMapClick },
    { title: '티맵', logo: tMapLogo, action: handleTMapClick },
    { title: '지도', logo: builtInMapLogo, action: handleBuiltInMapClick },
    { title: '주소복사', logo: copyLogo, action: handleCopyAddrClick },
  ];

  return (
    <CustomBottomSheet
      open={CustomDrawerStore.mapNavigationOpen}
      anchor='bottom'
      onClose={handleClose}
    >
      <Puller>
        <PullerChip />
      </Puller>
      <Header>길찾기</Header>
      {NAVI_LIST.map((list: ListType, idx: number) => (
        <ListWrap key={`list-wrap-${list.title}`} idx={idx} onClick={list.action}>
          <ListImage src={list.logo} alt={list.title} />
          {list.title}
        </ListWrap>
      ))}
      <HiddenAddress ref={copyAddrRef} value={locationData?.address} onChange={() => {}} />
    </CustomBottomSheet>
  );
};

export default observer(ImportedBottomSheet);

const CustomBottomSheet = styled(Drawer)({
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  height: 0,
  backgroundColor: palette.white,
  zIndex: 1500,
  '& .MuiPaper-root': {
    display: 'flex',
    borderRadius: '12px 12px 0px 0px',
    height: 408,
    color: palette.black,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '24px',
  },
});

const Puller = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

const PullerChip = styled('div')({
  borderRadius: 12,
  margin: '6px 0 16px',
  width: 48,
  height: 4,
  backgroundColor: palette.grey[300],
});

const Header = styled('div')({
  padding: '0 24px',
});

const ListWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'idx',
})<{ idx: number }>(({ idx }) => ({
  display: 'flex',
  borderBottom: idx === 4 ? 'none' : `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  marginTop: idx === 0 ? 16 : 0,
  fontSize: 14,
  lineHeight: '20px',
  gap: 8,
}));

const ListImage = styled('img')({
  width: 20,
  height: 20,
});

const HiddenAddress = styled('input')({
  display: 'none',
});
