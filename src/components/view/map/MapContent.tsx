import { useLayoutEffect, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { PlaceDataType, CategoryType } from 'types/typeBundle';
import { symbols, mapSelectedSymbols, geometry, locationRequestTypes, palette } from 'constants/';

const { kakao } = window;
let map: any;
let mainClusterer: any;
let overlay: any;
const mapInfo: { lat: number; lng: number } = { lat: 0, lng: 0 };
const MapContent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const placeName = searchParams.get('name') ?? '';
  const primaryCategories = useMemo(() => ['한강', '공원', '궁궐'], []);
  const { UserNavigatorStore, CustomDrawerStore, LocationStore, ScreenSizeStore } =
    useStore().MobxStore;
  const { drawerStatus } = CustomDrawerStore;
  const { locationData } = LocationStore;
  const categories = (LocationStore.categories ?? [])?.[placeName];

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
    variant: 'selected' | 'place',
    lat: number,
    lng: number,
    map: any,
    name: string,
    markerImage: string | null,
    mainMarker?: boolean
  ) => {
    const markerSize = variant === 'selected' ? 48 : 24;
    const kakaoMarkerSize = new kakao.maps.Size(markerSize, markerSize);
    const marker = new kakao.maps.Marker({
      image: markerImage && new kakao.maps.MarkerImage(markerImage, kakaoMarkerSize),
      position: new kakao.maps.LatLng(lat + 0.0003, lng),
      title: name,
      clickable: !mainMarker,
    });
    marker.setMap(map);
    kakao.maps.event.addListener(marker, 'click', () => {
      const clickedPlaceData = LocationStore.placesData.find(
        (place: PlaceDataType) => place.name === marker.Gb
      );
      if (!clickedPlaceData) return;
      CustomDrawerStore.setIncludesInput(false);
      navigate(`/map/detail/${clickedPlaceData.idx}?name=${marker.Gb}`);
    });
    mainMarker && mainClusterer?.addMarkers([marker]);
  };

  const getKakaoMap = () => {
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const latOffset =
      (drawerStatus.expanded === 'expanded' ? 0.00001 : 0.0000035) * ScreenSizeStore.screenHeight;
    map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(latitude - latOffset, longitude),
      level: 5,
      tileAnimation: false,
      speed: 3,
    });
    mainClusterer = new kakao.maps.MarkerClusterer({ map });
    [mapInfo.lat, mapInfo.lng] = [latitude - latOffset, longitude];
    const photoImage = mapSelectedSymbols?.[getSymbol(categories ?? [])] ?? null;
    kakao.maps.event.addListener(map, 'dragend', onDragEnd);
    if (!photoImage) return;
    setMarkerOnMap('selected', latitude, longitude, map, placeName, photoImage, true);
  };

  const setMapCenter = () => {
    if (!map) return;
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const isExpanded = drawerStatus.expanded === 'expanded';
    const latOffset = (isExpanded ? 0.00001 : 0.0000035) * ScreenSizeStore.screenHeight;
    map.setDraggable(!isExpanded);
    map.setZoomable(!isExpanded);
    map.setLevel(5);
    map.setCenter(
      new kakao.maps.LatLng(
        isExpanded ? latitude - latOffset : mapInfo.lat,
        isExpanded ? longitude : mapInfo.lng
      )
    );
  };

  const processGeometryCoordinates = (
    coordinates: [number, number][][],
    polygonPath: [number, number][]
  ) => {
    coordinates.forEach((coordinateArr: [number, number][]) => {
      coordinateArr.forEach(([thisLatitude, thisLongitude]: [number, number]) => {
        polygonPath.push(new window.kakao.maps.LatLng(thisLatitude, thisLongitude));
      });
    });
  };

  const highlightMap = useCallback(() => {
    overlay?.setMap(null);
    if (!locationData) return;
    const locationName = locationData.name;
    if (locationRequestTypes.skt.includes(placeName)) return;
    const coordinates: [number, number][][] | [number, number][][][] =
      geometry[locationName].coordinates;
    const geometryType: 'Polygon' | 'MultiPolygon' = geometry[locationName].type;
    const polygonPath: [number, number][] = [];
    if (geometryType === 'Polygon') {
      processGeometryCoordinates(coordinates as [number, number][][], polygonPath);
    } else {
      (coordinates as [number, number][][][]).forEach((subCoordinates: [number, number][][]) =>
        processGeometryCoordinates(subCoordinates, polygonPath)
      );
    }
    overlay = new window.kakao.maps.Polygon({
      path: polygonPath,
      strokeWeight: 1,
      strokeColor: palette.red,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      fillColor: palette.red,
      fillOpacity: 0.4,
    });
  }, [locationData, placeName]);

  useLayoutEffect(() => {
    getKakaoMap();
    highlightMap();
    overlay?.setMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserNavigatorStore.dataLocation]);

  useEffect(() => {
    if (drawerStatus.expanded !== 'removed') return;
    mainClusterer?.clear();
    overlay?.setMap(null);
    LocationStore.placesData.forEach((place: PlaceDataType) => {
      const { name, categories, x, y } = place;
      setMarkerOnMap('place', x, y, map, name, symbols[getSymbol(categories)]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerStatus.expanded, LocationStore.placesData, getSymbol]);

  useEffect(() => {
    if (!['expanded', 'appeared'].includes(drawerStatus.expanded)) return;
    if (CustomDrawerStore.placeDataLoading) return;
    setMapCenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerStatus.expanded, CustomDrawerStore.placeDataLoading]);

  return (
    <Wrap top={['removed', 'appeared'].includes(drawerStatus.expanded) ? 105 : 48}>
      <Map ref={mapRef} className='kakao-map' />
    </Wrap>
  );
};

export default observer(MapContent);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'top',
})<{ top: number }>(({ top }) => ({
  position: 'fixed',
  top,
  width: '100%',
  maxWidth: 430,
  height: 'calc(100vh - 104px)',
}));

const Map = styled('div')({
  width: '100%',
  height: '100%',
});
