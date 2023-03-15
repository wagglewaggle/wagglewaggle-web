import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Rnd, ResizableDelta } from 'react-rnd';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Mousewheel } from 'swiper';
import {
  CongestionSummary,
  DetailedCongestion,
  RealtimeReviews,
  RelatedLocations,
} from './resizer';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { LocationDataType, PlaceDataType } from 'types/typeBundle';
import { palette, locationNames, locationRequestTypes, districts } from 'constants/';
import { resizerFunctions } from './resizer/resizerFunctions';

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

SwiperCore.use([Mousewheel]);
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
  const pathnameArr: string[] = pathname.split('/');
  const [swiper, setSwiper] = useState<SwiperCore>();
  const [relatedPlaces, setRelatedPlaces] = useState<string[]>([]);
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

  const setResizeData = (
    newExpanded: 'removed' | 'appeared' | 'expanded' | 'full',
    newDragHeight: number,
    newTouchIndex: number
  ) => {
    CustomDrawerStore.setDrawerStatus({ expanded: newExpanded, dragHeight: newDragHeight });
    setTouchIndex(newTouchIndex);
    newExpanded === 'full' ? swiper?.mousewheel.enable() : swiper?.mousewheel.disable();
  };

  const onResize = (
    e: MouseEvent | TouchEvent,
    dir: string,
    ref: Element,
    delta: ResizableDelta
  ) => {
    setTransformDeltaY(delta.height);
    CustomDrawerStore.initRndResizerFunctionConfig();
  };

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: string,
    ref: Element,
    delta: ResizableDelta
  ) => {
    setTransformDeltaY(0);
    const { height } = delta;
    if (height === 0) {
      const currentKey = CustomDrawerStore.rndResizerFunctionConfig.currentKey;
      const selectedFunction = resizerFunctions()?.[currentKey ?? ''];
      selectedFunction && selectedFunction();
      return;
    }
    if (touchIndex !== 0) return;
    const isExpanded = height >= 0;
    if (drawerStatus.expanded === 'appeared') {
      setResizeData(
        isExpanded ? 'expanded' : 'removed',
        isExpanded ? EXPANDED_HEIGHT : 0,
        isExpanded ? 0 : touchIndex
      );
      if (!isExpanded) {
        handleClose();
      }
    }
    if (drawerStatus.expanded === 'expanded') {
      setResizeData(
        isExpanded ? 'full' : 'appeared',
        isExpanded ? FULL_HEIGHT : APPEARED_HEIGHT,
        isExpanded ? 0 : touchIndex
      );
    }
    if (drawerStatus.expanded === 'full') {
      setResizeData(
        isExpanded ? 'full' : 'expanded',
        isExpanded ? FULL_HEIGHT : EXPANDED_HEIGHT,
        isExpanded ? 0 : touchIndex
      );
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

  const initLocationData = async () => {
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
  };

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

  useEffect(() => {
    if (!swiper?.slideTo) return;
    swiper.slideTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    initRelatedLocations();
  }, [initRelatedLocations]);

  useEffect(() => {
    setTouchIndex(0);
    setIsBeginning(true);
    setSwipeEnabled(CustomDrawerStore.drawerStatus.expanded === 'full');
  }, [CustomDrawerStore.drawerStatus.expanded]);

  useEffect(() => {
    initLocationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (CustomDrawerStore.drawerStatus.expanded !== 'removed') return;
    CustomDrawerStore.setDrawerStatus({ expanded: 'appeared', dragHeight: APPEARED_HEIGHT });
  }, [open, CustomDrawerStore, CustomDrawerStore.drawerStatus.expanded]);

  return (
    <CustomRnd
      borderTopRadius={APPEARED_HEIGHT === drawerStatus.dragHeight ? 12 : 0}
      screenHeight={ScreenSizeStore.screenHeight}
      dragHeight={drawerStatus.dragHeight}
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
              mousewheel={false}
              allowTouchMove={false}
              onTouchStart={isMobile ? onTouchStart : undefined}
              onTouchEnd={isMobile ? onTouchEnd : undefined}
              onSwiper={(swiper) => setSwiper(swiper)}
              speed={500}
              slidesPerView='auto'
            >
              <CustomSwiperSlide>
                <CongestionSummary />
              </CustomSwiperSlide>
              <CustomSwiperSlide>
                <DetailedCongestion />
              </CustomSwiperSlide>
              <CustomSwiperSlide>
                <RealtimeReviews />
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

export default observer(CustomResizer);

const CustomRnd = styled(Rnd, {
  shouldForwardProp: (prop: string) =>
    !['borderTopRadius', 'screenHeight', 'dragHeight', 'transformDeltaY'].includes(prop),
})<{
  borderTopRadius: number;
  screenHeight: number;
  dragHeight: number;
  transformDeltaY: number;
}>(({ borderTopRadius, screenHeight, dragHeight, transformDeltaY }) => ({
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
  transform: `translate(auto, ${screenHeight - dragHeight - transformDeltaY}px) !important`,
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
