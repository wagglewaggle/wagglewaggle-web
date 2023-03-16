import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { LocationDataType, PlaceDataType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes, districts } from 'constants/';

type ExpandedType = 'removed' | 'appeared' | 'expanded' | 'full';

const BottomSheet = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { ThemeStore, CustomDrawerStore, UserNavigatorStore, LocationStore, ScreenSizeStore } =
    useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const { variant, drawerStatus } = CustomDrawerStore;
  const FULL_HEIGHT = -ScreenSizeStore.screenHeight;
  const EXPANDED_HEIGHT = -ScreenSizeStore.screenHeight * 0.6;
  const APPEARED_HEIGHT = -196;
  const CANCEL_HEIGHT = (Math.abs(FULL_HEIGHT) - Math.abs(EXPANDED_HEIGHT)) * 0.95;
  const pathnameArr: string[] = pathname.split('/');
  const sheetRef = useRef<HTMLDivElement>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<string[]>([]);
  const [positionY, setPositionY] = useState<number>(APPEARED_HEIGHT);
  const [{ y }, api] = useSpring(() => ({ y: APPEARED_HEIGHT }));

  const handleClose = useCallback(() => {
    navigate(`/${variant}`);
    CustomDrawerStore.closeDrawer();
    CustomDrawerStore.setIncludesInput(true);
    LocationStore.setLocationData(null);
  }, [navigate, variant, CustomDrawerStore, LocationStore]);

  const initLocationData = useCallback(async () => {
    if (search.length === 0) return;
    const placeName: string = decodeURI(search).replace('?name=', '');
    LocationStore.setPlaceName(placeName);
    const requestType: string = locationRequestTypes.skt.includes(
      locationNames[placeName] || placeName
    )
      ? 'SKT'
      : 'KT';
    const placeId: string = pathnameArr[pathnameArr.length - 1];
    if (!Number(placeId)) {
      navigate(`/${CustomDrawerStore.variant}`);
      return;
    }
    const response: { data: LocationDataType } | undefined = await axiosRequest(
      'get',
      `place/${requestType}/${placeId}`
    );
    if (!response) return;
    const { data } = response;
    LocationStore.setLocationData(data);
    UserNavigatorStore.setDataLocation([data.x, data.y]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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
    if (!response) return;
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

  const makeLastMove = (offsetY: number) => {
    const expandedMap: { [key: string]: ExpandedType } = {
      0: 'removed',
      [APPEARED_HEIGHT]: 'appeared',
      [EXPANDED_HEIGHT]: 'expanded',
      [FULL_HEIGHT]: 'full',
    };
    const newPositionY = Object.keys(expandedMap)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - offsetY) < Math.abs(prev - offsetY) ? curr : prev));
    api.start({ y: newPositionY });
    setPositionY(newPositionY);
    CustomDrawerStore.setDrawerStatus({ expanded: expandedMap[newPositionY] });
  };

  const bind = useDrag(
    (props) => {
      const { offset, initial, direction, xy, last, cancel } = props;
      const [, oy] = offset;
      const [, iy] = initial;
      const [, dy] = direction;
      const [, yy] = xy;
      const movementY = yy - iy;
      if (shouldBeCanceled(movementY, positionY, dy === 1)) {
        cancel();
      }
      if (!last) {
        shouldBeCanceled(movementY, positionY, dy === 1);
        api.start({ y: positionY + movementY });
        return;
      }
      makeLastMove(oy);
    },
    { filterTaps: true, pointer: { touch: true } }
  );

  useEffect(() => {
    api.start({ y: APPEARED_HEIGHT, config: { mass: 0.1, friction: 12, velocity: 180 } });
  }, [api, APPEARED_HEIGHT]);

  useEffect(() => {
    sheetRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (drawerStatus.expanded !== 'removed') return;
    handleClose();
  }, [drawerStatus.expanded, handleClose]);

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
      <SheetWrap isDarkTheme={isDarkTheme} expanded={drawerStatus.expanded} ref={sheetRef}>
        {drawerStatus.expanded === 'appeared' && (
          <Puller isDarkTheme={isDarkTheme}>
            <PullerChip />
          </Puller>
        )}
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
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  overflow: `hidden ${expanded === 'full' ? 'scroll' : 'hidden'}`,
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
