import { useEffect, useCallback, useRef, useMemo } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { PlaceDataType, CategoryType } from 'types/typeBundle';
import { palette, symbols } from 'constants/';
import defaultPhoto from 'assets/icons/register/default-photo.png';

let map: any;
const mapInfo: { lat: number; lng: number } = { lat: 0, lng: 0 };
const MapContent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const primaryCategories = useMemo(() => ['한강', '공원', '궁궐'], []);
  const { UserNavigatorStore, CustomDrawerStore, ScreenSizeStore } = useStore().MobxStore;
  const { drawerStatus } = CustomDrawerStore;

  const onDragEnd = useCallback(() => {
    if (!map || !map.getDraggable()) return;
    const center = map.getCenter();
    [mapInfo.lat, mapInfo.lng] = [center.Ma, center.La];
  }, []);

  const getSymbol = useCallback(
    (categories: CategoryType[]) => {
      const categoryList = categories.map((category: CategoryType) => category.type);
      const symbolCandidate = categoryList.filter((category: string) =>
        primaryCategories.includes(category)
      );
      return symbolCandidate.length > 0 ? symbolCandidate[0] : categoryList[0];
    },
    [primaryCategories]
  );

  const setMarkerOnMap = (
    variant: 'profile' | 'place',
    lat: number,
    lng: number,
    map: any,
    name: string,
    markerImage: string | null
  ) => {
    const markerSize = variant === 'profile' ? 35 : 24;
    const kakaoMarkerSize = new window.kakao.maps.Size(markerSize, markerSize);
    const marker = new window.kakao.maps.Marker({
      image: markerImage && new window.kakao.maps.MarkerImage(markerImage, kakaoMarkerSize),
      position: new window.kakao.maps.LatLng(lat + 0.0003, lng),
      title: name,
    });
    marker.setMap(map);
  };

  const getOpacityCircleOnMap = (lat: number, lng: number) =>
    new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(lat, lng),
      radius: 10000000,
      strokeWeight: 1,
      strokeColor: palette.white,
      strokeOpacity: 0.4,
      fillColor: palette.white,
      fillOpacity: 0.4,
    });

  const getKakaoMap = () => {
    if (['expanded', 'full'].includes(drawerStatus.expanded)) return;
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const latOffset =
      (drawerStatus.expanded === 'appeared' ? 0.0000035 : 0) * ScreenSizeStore.screenHeight;
    window.kakao.maps.load(() => {
      map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(latitude - latOffset, longitude),
        level: 5,
      });
      CustomDrawerStore.placeData.forEach((place: PlaceDataType) => {
        const { name, categories, x, y } = place;
        setMarkerOnMap('place', x, y, map, name, symbols[getSymbol(categories)]);
      });
      const photoImage = UserNavigatorStore.isUserLocation ? defaultPhoto : null;
      setMarkerOnMap('profile', latitude, longitude, map, '와글와글', photoImage);
      getOpacityCircleOnMap(latitude, longitude).setMap(map);
      [mapInfo.lat, mapInfo.lng] = [latitude, longitude];
      window.kakao.maps.event.addListener(map, 'dragend', onDragEnd);
    });
  };

  const setMapCenter = () => {
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const isExpanded = drawerStatus.expanded === 'expanded';
    const latOffset = (isExpanded ? 0.00001 : 0.0000035) * ScreenSizeStore.screenHeight;
    map.setDraggable(!isExpanded);
    map.setZoomable(!isExpanded);
    map.setLevel(5);
    map.panTo(
      new window.kakao.maps.LatLng(
        isExpanded ? latitude - latOffset : mapInfo.lat,
        isExpanded ? longitude : mapInfo.lng
      )
    );
  };

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);
    mapScript.addEventListener('load', getKakaoMap);
    return () => mapScript.removeEventListener('load', getKakaoMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserNavigatorStore.dataLocation]);

  useEffect(() => {
    if (!map || !['expanded', 'appeared'].includes(drawerStatus.expanded)) return;
    setMapCenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerStatus.expanded]);

  return (
    <Wrap>
      <Map ref={mapRef} />
    </Wrap>
  );
};

export default observer(MapContent);

const Wrap = styled('div')({
  width: '100%',
  height: 'calc(100vh - 104px)',
});

const Map = styled('div')({
  width: '100%',
  height: '100%',
});
