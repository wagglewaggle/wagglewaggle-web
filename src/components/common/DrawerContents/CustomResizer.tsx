import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Rnd, ResizableDelta } from 'react-rnd';
import { styled } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CongestionSummary, DetailedCongestion, Reviews, RelatedLocations } from './resizer';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType, PlaceDataType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes, districts } from 'constants/';

type SwiperType = {
  activeIndex: number;
  touches: {
    startY: number;
    prevY?: number;
    currentY: number;
  };
  allowTouchMove: boolean;
  isBeginning: boolean;
};

const swiperStatus = { startY: 0, endY: 0 };
const CustomResizer = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { ThemeStore, CustomDrawerStore, UserNavigatorStore, LocationStore, ScreenSizeStore } =
    useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const { open, variant, drawerStatus } = CustomDrawerStore;
  const FULL_HEIGHT = ScreenSizeStore.screenHeight;
  const EXPANDED_HEIGHT = ScreenSizeStore.screenHeight * 0.6;
  const APPEARED_HEIGHT = 196;
  const DRAWER_X = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) ? 0 : 327;
  const [relatedPlaces, setRelatedPlaces] = useState<PlaceDataType[]>([]);
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [swipeEnabled, setSwipeEnabled] = useState<boolean>(false);
  const [touchIndex, setTouchIndex] = useState<number>(0);
  const [transformDeltaY, setTransformDeltaY] = useState<number>(0);

  const handleClose = () => {
    navigate(`/${variant}`);
    CustomDrawerStore.closeDrawer();
    CustomDrawerStore.setIncludesInput(true);
    LocationStore.setLocationData(null);
  };

  const onResize = (
    e: MouseEvent | TouchEvent,
    dir: string,
    ref: Element,
    delta: ResizableDelta
  ) => {
    setTransformDeltaY(delta.height);
  };

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: string,
    ref: Element,
    delta: ResizableDelta
  ) => {
    setTransformDeltaY(0);
    const { height } = delta;
    if (height === 0 || touchIndex !== 0) return;
    const isExpanded = height >= 0;
    if (drawerStatus.expanded === 'appeared') {
      if (!isExpanded) {
        handleClose();
        return;
      }
      CustomDrawerStore.setDrawerStatus({ expanded: 'expanded', dragHeight: EXPANDED_HEIGHT });
    }
    if (drawerStatus.expanded === 'expanded') {
      CustomDrawerStore.setDrawerStatus({
        expanded: isExpanded ? 'full' : 'appeared',
        dragHeight: isExpanded ? FULL_HEIGHT : APPEARED_HEIGHT,
      });
    }
    if (drawerStatus.expanded === 'full' && !isExpanded) {
      CustomDrawerStore.setDrawerStatus({
        expanded: 'expanded',
        dragHeight: EXPANDED_HEIGHT,
      });
    }
  };

  const onTouchStart = (swiper: SwiperType, e: MouseEvent | TouchEvent) => {
    const { activeIndex, touches, isBeginning } = swiper;
    const { startY, prevY } = touches;
    const movingUp = (prevY ?? 0) > startY;
    swiperStatus.startY = startY;
    setIsBeginning(isBeginning);

    setTouchIndex(activeIndex);
    if (swipeEnabled && !movingUp) {
      swiper.allowTouchMove = true;
      return;
    }
    if (!swipeEnabled || (activeIndex === 0 && movingUp)) {
      swiper.allowTouchMove = false;
    }
  };

  const onTouchEnd = (swiper: SwiperType) => {
    const { activeIndex, touches } = swiper;
    swiperStatus.endY = touches.startY;
    const movingUp = swiperStatus.startY < swiperStatus.endY;
    setTouchIndex(activeIndex);
    if (activeIndex === 1 && movingUp) {
      swiper.allowTouchMove = false;
    }
  };

  const initLocationData = useCallback(async () => {
    if (search.length === 0) return;
    const placeName: string = decodeURI(search).replace('?name=', '');
    LocationStore.setPlaceName(placeName);
    const requestType: string = locationRequestTypes.skt.includes(
      locationNames[placeName] || placeName
    )
      ? 'SKT'
      : 'KT';
    const pathnameArr: string[] = pathname.split('/');
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
  }, [LocationStore, CustomDrawerStore, UserNavigatorStore, navigate, pathname, search]);

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
      [...response.data.ktPlaces, ...response.data.sktPlaces].filter(
        (place: PlaceDataType) => place.name !== LocationStore.placeName
      )
    );
  }, [LocationStore.placeName]);

  useEffect(() => {
    initRelatedLocations();
  }, [LocationStore.placeName, initRelatedLocations]);

  useEffect(() => {
    setSwipeEnabled(CustomDrawerStore.drawerStatus.expanded === 'full');
  }, [CustomDrawerStore.drawerStatus.expanded]);

  useEffect(() => {
    setTouchIndex(0);
    setIsBeginning(true);
  }, []);

  useEffect(() => {
    initLocationData();
  }, [initLocationData, LocationStore.placeName]);

  useEffect(() => {
    if (!open) return;
    CustomDrawerStore.setDrawerStatus({ expanded: 'appeared', dragHeight: APPEARED_HEIGHT });
  }, [open, CustomDrawerStore]);

  return (
    <CustomRnd
      borderTopRadius={APPEARED_HEIGHT === drawerStatus.dragHeight ? 12 : 0}
      screenHeight={ScreenSizeStore.screenHeight}
      dragHeight={drawerStatus.dragHeight}
      transformX={DRAWER_X}
      transformDeltaY={transformDeltaY}
      resizeGrid={[1, Number(isBeginning)]}
      position={{ x: 0, y: ScreenSizeStore.screenHeight - drawerStatus.dragHeight }}
      resizeHandleStyles={{
        top: {
          top: 0,
          height: drawerStatus.dragHeight,
          cursor: 'grab',
          backgroundColor: palette.transparent,
        },
        topLeft: { display: 'none' },
        topRight: { display: 'none' },
        bottomLeft: { display: 'none' },
        bottomRight: { display: 'none' },
        left: { display: 'none' },
        right: { display: 'none' },
        bottom: { display: 'none' },
      }}
      resizeHandleComponent={{
        top: (
          <>
            {APPEARED_HEIGHT === drawerStatus.dragHeight && (
              <Puller isDarkTheme={isDarkTheme}>
                <PullerChip />
              </Puller>
            )}
            <CustomSwiper
              isDarkTheme={isDarkTheme}
              direction='vertical'
              allowTouchMove={false}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              speed={500}
              slidesPerView='auto'
            >
              <CustomSwiperSlide>
                <CongestionSummary />
              </CustomSwiperSlide>
              <CustomSwiperSlide>
                <DetailedCongestion initLocationData={initLocationData} />
              </CustomSwiperSlide>
              <CustomSwiperSlide>
                <Reviews />
              </CustomSwiperSlide>
              {relatedPlaces.length > 0 && (
                <CustomSwiperSlide>
                  <RelatedLocations places={relatedPlaces} />
                </CustomSwiperSlide>
              )}
            </CustomSwiper>
          </>
        ),
      }}
      maxHeight={FULL_HEIGHT}
      onResize={onResize}
      onResizeStop={onResizeStop}
      size={{ width: ScreenSizeStore.screenWidth, height: drawerStatus.dragHeight }}
    />
  );
};

export default CustomResizer;

const CustomRnd = styled(Rnd, {
  shouldForwardProp: (prop: string) =>
    !['borderTopRadius', 'screenHeight', 'dragHeight', 'transformX', 'transformDeltaY'].includes(
      prop
    ),
})<{
  borderTopRadius: number;
  screenHeight: number;
  dragHeight: number;
  transformX: number;
  transformDeltaY: number;
}>(({ borderTopRadius, screenHeight, dragHeight, transformX, transformDeltaY }) => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  borderTopLeftRadius: borderTopRadius,
  borderTopRightRadius: borderTopRadius,
  width: 'calc(100% - 2px)',
  overflow: 'hidden',
  zIndex: 10,
  backgroundColor: palette.white,
  boxShadow: '0px -10px 40px rgb(0 0 0 / 30%)',
  transform: `translate(${transformX}px, ${
    screenHeight - dragHeight - transformDeltaY
  }px) !important`,
}));

const CustomSwiper = styled(Swiper, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  overflow: 'hidden',
  zIndex: 100,
  '& .swiper-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    backgroundColor: palette.grey[200],
  },
}));

const PullerChip = styled('div')({
  borderRadius: 12,
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
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  height: 16,
  backgroundColor: isDarkTheme ? palette.black : palette.white,
}));

const CustomSwiperSlide = styled(SwiperSlide)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: palette.white,
});
