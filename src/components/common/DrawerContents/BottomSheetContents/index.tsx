import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useSpring, a } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import CongestionSummary from './CongestionSummary';
import DetailedCongestion from './DetailedCongestion';
import RealtimeReviews from './RealtimeReviews';
import RelatedLocations from './RelatedLocations';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType, PlaceDataType, RequestType } from 'types/typeBundle';
import { palette, locationNames, districts } from 'constants/';

type ExpandedType = 'removed' | 'appeared' | 'expanded' | 'full';

const BottomSheet = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    ThemeStore,
    CustomDrawerStore,
    UserNavigatorStore,
    LocationStore,
    ScreenSizeStore,
    ReviewStore,
  } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const { variant, drawerStatus } = CustomDrawerStore;
  const { placesData } = LocationStore;
  const FULL_HEIGHT = -ScreenSizeStore.screenHeight;
  const EXPANDED_HEIGHT = -Math.round(ScreenSizeStore.screenHeight * 0.6);
  const APPEARED_HEIGHT = -196;
  const CANCEL_HEIGHT = (Math.abs(FULL_HEIGHT) - Math.abs(EXPANDED_HEIGHT)) * 0.95;
  const sheetRef = useRef<HTMLDivElement>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<string[]>([]);
  const [positionY, setPositionY] = useState<number>(APPEARED_HEIGHT);
  const [dragEnabled, setDragEnabled] = useState<boolean>(true);
  const [{ y }, api] = useSpring(() => ({ y: APPEARED_HEIGHT }));

  const handleClose = useCallback(() => {
    navigate(`/${variant}`);
    setPositionY(0);
    CustomDrawerStore.closeDrawer();
    CustomDrawerStore.setIncludesInput(true);
    LocationStore.setLocationData(null);
  }, [navigate, variant, CustomDrawerStore, LocationStore]);

  const initLocationData = useCallback(async () => {
    const placeName = searchParams.get('name') ?? '';
    const pathnameArr = pathname.split('/');
    if (!placeName || pathnameArr.includes('review')) return;
    LocationStore.setPlaceName(placeName);
    const requestType: RequestType | undefined = placesData.find(
      (data) => data.name === placeName
    )?.type;
    const placeId: string = pathnameArr[pathnameArr.length - 1];
    if (!requestType || !Number(placeId)) {
      navigate(`/${CustomDrawerStore.variant}`);
      return;
    }
    const response: { data: LocationDataType } | undefined = await axiosRequest(
      'get',
      `place/${requestType}/${placeId}`
    );
    CustomDrawerStore.setPlaceDataLoading(false);
    if (!response) return;
    const { data } = response;
    LocationStore.setLocationData(data);
    UserNavigatorStore.setDataLocation([data.x, data.y]);
  }, [
    CustomDrawerStore,
    LocationStore,
    UserNavigatorStore,
    navigate,
    pathname,
    searchParams,
    placesData,
  ]);

  const initRelatedLocations = useCallback(async () => {
    if (
      !LocationStore.placeName ||
      !districts[locationNames[LocationStore.placeName] || LocationStore.placeName]
    )
      return;
    type responseType = { data: { ktPlaces: PlaceDataType[]; sktPlaces: PlaceDataType[] } };
    const response: responseType | undefined = await axiosRequest(
      'get',
      `location/${districts[locationNames[LocationStore.placeName] || LocationStore.placeName]}`
    );
    if (!response?.data?.ktPlaces || !response?.data?.sktPlaces) return;
    setRelatedPlaces(
      [...response.data.ktPlaces, ...response.data.sktPlaces]
        .filter((place: PlaceDataType) => place.name !== LocationStore.placeName)
        .map((place: PlaceDataType) => place.name)
    );
  }, [LocationStore.placeName]);

  const shouldBeCanceled = (movementY: number, positionY: number, movingDown: boolean) => {
    if (drawerStatus.expanded === 'appeared' && movingDown) {
      return Math.abs(movementY) > 100;
    }
    if (movementY + positionY < FULL_HEIGHT) {
      return true;
    }
    return Math.abs(movementY) > CANCEL_HEIGHT;
  };

  const setSheetStates = (newDrawerStats: ExpandedType, newPositionY: number) => {
    CustomDrawerStore.setDrawerStatus({ expanded: newDrawerStats });
    api.start({ y: newPositionY });
    setPositionY(newPositionY);
  };

  const makeLastMove = (dy: number) => {
    if (dy === 0) return;
    const movingDown = dy === 1;
    const { expanded } = drawerStatus;
    if (expanded === 'appeared') {
      setSheetStates(movingDown ? 'removed' : 'expanded', movingDown ? 0 : EXPANDED_HEIGHT);
    }
    if (expanded === 'expanded') {
      setSheetStates(movingDown ? 'appeared' : 'full', movingDown ? APPEARED_HEIGHT : FULL_HEIGHT);
    }
    if (expanded === 'full') {
      setSheetStates(movingDown ? 'expanded' : 'full', movingDown ? EXPANDED_HEIGHT : FULL_HEIGHT);
    }
  };

  const bind = useDrag(
    (props) => {
      const pathnameArr = pathname.split('/');
      if (pathnameArr.includes('review')) return;
      const { direction, movement, last, cancel } = props;
      const [, dy] = direction;
      const [, my] = movement;
      if (shouldBeCanceled(my, positionY, dy === 1)) {
        cancel();
      }
      if (!last) {
        shouldBeCanceled(my, positionY, dy === 1);
        api.start({ y: positionY + my });
        return;
      }
      makeLastMove(dy);
    },
    { threshold: 10, enabled: dragEnabled }
  );

  useEffect(() => {
    const refCurrent = sheetRef.current;

    const preventDrag = () => {
      const scrollPosition = refCurrent?.scrollTop;
      if (typeof scrollPosition === 'number' && scrollPosition < 50) {
        setDragEnabled(true);
        return;
      }
      setDragEnabled(false);
    };

    refCurrent?.addEventListener('scroll', preventDrag);
    return () => refCurrent?.removeEventListener('scroll', preventDrag);
  }, []);

  useEffect(() => {
    sheetRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (drawerStatus.expanded === 'appeared') {
      api.start({ y: APPEARED_HEIGHT });
      setPositionY(APPEARED_HEIGHT);
    }
    if (drawerStatus.expanded === 'removed') {
      handleClose();
    }
    ReviewStore.setWriteReviewButtonVisible(['expanded', 'full'].includes(drawerStatus.expanded));
  }, [api, APPEARED_HEIGHT, drawerStatus.expanded, handleClose, ReviewStore]);

  useEffect(() => {
    initLocationData();
    initRelatedLocations();
  }, [initLocationData, initRelatedLocations]);

  return (
    <BottomSheetWrap
      isDarkTheme={isDarkTheme}
      expanded={drawerStatus.expanded}
      {...bind()}
      style={{ x: '-50%', y }}
    >
      {drawerStatus.expanded === 'appeared' && (
        <Puller isDarkTheme={isDarkTheme}>
          <PullerChip />
        </Puller>
      )}
      <SheetWrap isDarkTheme={isDarkTheme} expanded={drawerStatus.expanded} ref={sheetRef}>
        <CongestionSummary />
        <DetailedCongestion />
        <RealtimeReviews />
        {relatedPlaces.length > 0 && <RelatedLocations places={relatedPlaces} />}
      </SheetWrap>
    </BottomSheetWrap>
  );
};

export default observer(BottomSheet);

const BottomSheetWrap = styled(a.div, {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'expanded'].includes(prop),
})<{ isDarkTheme: boolean; expanded: ExpandedType }>(({ isDarkTheme, expanded }) => ({
  position: 'fixed',
  top: '100vh',
  left: '50%',
  display: 'block',
  borderRadius: expanded === 'appeared' ? '12px 12px 0px' : 'none',
  width: '100%',
  maxWidth: 430,
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  touchAction: 'none',
  boxShadow: '0px -10px 40px rgb(0 0 0 / 30%)',
  zIndex: 10,
}));

const SheetWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'expanded'].includes(prop),
})<{ isDarkTheme: boolean; expanded: ExpandedType }>(({ isDarkTheme, expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: expanded === 'appeared' ? '12px 12px 0px' : 'none',
  width: '100%',
  height: 'calc(100vh - 48px)',
  minHeight: '100vh',
  backgroundColor: palette.grey[200],
  overflow: `hidden ${expanded === 'full' ? 'scroll' : 'hidden'}`,
  gap: 6,
}));

const PullerChip = styled('div')({
  borderRadius: 12,
  margin: '6px 0 16px',
  width: 48,
  height: 4,
  backgroundColor: palette.grey[300],
});

const Puller = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px 12px 0px',
  height: 32,
  backgroundColor: isDarkTheme ? palette.black : palette.white,
}));
