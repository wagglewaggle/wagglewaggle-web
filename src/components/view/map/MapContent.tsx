import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { PlaceDataType, CategoryType, StatusType } from 'types/typeBundle';
import { symbols, geometry, palette, excludedCategories } from 'constants/';
import { getMapSelectedSymbol } from 'util/';
import _ from 'lodash';

const { kakao } = window;
let overlay: any;
const mapInfo: { lat: number; lng: number } = { lat: 0, lng: 0 };
const MapContent = () => {
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [allMarkers, setAllMarkers] = useState<any[]>([]);
  const [allSelectedMarkers, setAllSelectedMarkers] = useState<{ [key: string]: any }>({});
  const [markerNamesOnMap, setMarkerNamesOnMap] = useState<string[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const placeName = searchParams.get('name') ?? '';
  const primaryCategories = useMemo(() => ['강변', '공원', '궁궐'], []);
  const { UserNavigatorStore, CustomDrawerStore, LocationStore, ScreenSizeStore, CategoryStore } =
    useStore().MobxStore;
  const { drawerStatus } = CustomDrawerStore;
  const { selectedCategories } = CategoryStore;
  const { locationData, placesData } = LocationStore;
  const locationStatus = locationData?.population?.level ?? 'NO_STATUS';

  const getSymbol = useCallback(
    (categories: CategoryType[]) => {
      const categoryList = categories
        .map((category: CategoryType) => category.type)
        .filter((category: string) => !excludedCategories.includes(category));
      const symbolCandidate = categoryList.filter((category: string) =>
        primaryCategories.includes(category)
      );
      return symbolCandidate.length > 0 ? symbolCandidate[0] : categoryList[0];
    },
    [primaryCategories]
  );

  const setMarkerOnMap = useCallback(
    (
      variant: 'selected' | 'place',
      lat: number,
      lng: number,
      name: string,
      markerImage: string | null,
      mainMarker?: boolean
    ) => {
      const markerSize = variant === 'selected' ? 64 : 30;
      const kakaoMarkerSize = new kakao.maps.Size(markerSize, markerSize);
      const marker = new kakao.maps.Marker({
        image: markerImage && new kakao.maps.MarkerImage(markerImage, kakaoMarkerSize),
        position: new kakao.maps.LatLng(lat + 0.0003, lng),
        title: name,
        clickable: !mainMarker,
      });
      kakao.maps.event.addListener(marker, 'click', () => {
        const clickedPlaceData = placesData.find(
          (place: PlaceDataType) => place.name === marker.Gb
        );
        if (!clickedPlaceData) return;
        CustomDrawerStore.setIncludesInput(false);
        navigate(`/map/detail/${clickedPlaceData.idx}?name=${marker.Gb}`);
      });
      return marker;
    },
    [CustomDrawerStore, navigate, placesData]
  );

  const getKakaoMap = useCallback(() => {
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const latOffset =
      (drawerStatus.expanded === 'expanded' ? 0.00001 : 0.0000035) * ScreenSizeStore.screenHeight;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(latitude - latOffset, longitude),
      level: 5,
      tileAnimation: false,
      speed: 3,
    });
    setKakaoMap(map);
  }, [ScreenSizeStore.screenHeight, UserNavigatorStore.dataLocation, drawerStatus.expanded]);

  const setKakaoMapLocationInfo = useCallback(() => {
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const latOffset =
      (drawerStatus.expanded === 'expanded' ? 0.00001 : 0.0000035) * ScreenSizeStore.screenHeight;
    [mapInfo.lat, mapInfo.lng] = [latitude - latOffset, longitude];
  }, [ScreenSizeStore.screenHeight, UserNavigatorStore.dataLocation, drawerStatus.expanded]);

  const setMapCenter = useCallback(() => {
    const [latitude, longitude] = UserNavigatorStore.dataLocation;
    const isExpanded = drawerStatus.expanded === 'expanded';
    const latOffset = (isExpanded ? 0.00001 : 0.0000035) * ScreenSizeStore.screenHeight;
    kakaoMap.setDraggable(!isExpanded);
    kakaoMap.setZoomable(!isExpanded);
    kakaoMap.setLevel(5);
    kakaoMap.panTo(
      new kakao.maps.LatLng(
        isExpanded ? latitude - latOffset : mapInfo.lat,
        isExpanded ? longitude : mapInfo.lng
      )
    );
  }, [
    ScreenSizeStore.screenHeight,
    UserNavigatorStore.dataLocation,
    drawerStatus.expanded,
    kakaoMap,
  ]);

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
    if (!locationData || drawerStatus.expanded === 'removed') return;
    const locationName = locationData.name;
    const coordinates: [number, number][][] | [number, number][][][] =
      geometry?.[locationName]?.coordinates;
    if (!coordinates) return;
    const geometryType: 'Polygon' | 'MultiPolygon' = geometry[locationName].type;
    const polygonPath: [number, number][] = [];
    if (geometryType === 'Polygon') {
      processGeometryCoordinates(coordinates as [number, number][][], polygonPath);
    } else {
      (coordinates as [number, number][][][]).forEach((subCoordinates: [number, number][][]) =>
        processGeometryCoordinates(subCoordinates, polygonPath)
      );
    }
    const overlayColors = {
      VERY_RELAXATION: palette.blue,
      RELAXATION: palette.green,
      NORMAL: palette.yellow,
      CROWDED: palette.orange,
      VERY_CROWDED: palette.red,
    };
    const overlayColor = overlayColors?.[locationStatus as StatusType];
    if (!overlayColor) return;
    overlay = new window.kakao.maps.Polygon({
      path: polygonPath,
      strokeWeight: 1,
      strokeColor: overlayColor,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      fillColor: overlayColor,
      fillOpacity: 0.4,
    });
    overlay.setMap(kakaoMap);
  }, [locationData, kakaoMap, locationStatus, drawerStatus.expanded]);

  const setMapOpacityOverlay = useCallback(() => {
    if (!kakaoMap) return;
    kakaoMap.setMaxLevel(13);
    new kakao.maps.Circle({
      center: new kakao.maps.LatLng(37.625638, 127.038941),
      radius: 2000000,
      strokeColor: palette.white,
      strokeOpacity: 0.4,
      fillColor: palette.white,
      fillOpacity: 0.4,
    }).setMap(kakaoMap);
  }, [kakaoMap]);

  useEffect(() => {
    if (!kakaoMap) {
      getKakaoMap();
    }
    setKakaoMapLocationInfo();
    highlightMap();
  }, [
    kakaoMap,
    UserNavigatorStore.dataLocation,
    highlightMap,
    getKakaoMap,
    setKakaoMapLocationInfo,
  ]);

  useEffect(() => {
    if (!kakaoMap) return;
    setMapOpacityOverlay();
  }, [kakaoMap, setMapOpacityOverlay]);

  useEffect(() => {
    if (allMarkers.length > 0) return;
    setAllMarkers(
      placesData.map((place: PlaceDataType) => {
        const { name, categories, x, y } = place;
        return setMarkerOnMap('place', x, y, name, symbols[getSymbol(categories)]);
      })
    );
    const selectedMarkers: { [key: string]: any } = {};
    (
      [
        'VERY_CROWDED',
        'CROWDED',
        'NORMAL',
        'RELAXATION',
        'VERY_RELAXATION',
        'NO_STATUS',
      ] as StatusType[]
    ).forEach((status: StatusType) => {
      selectedMarkers[status] = [];
      placesData.forEach((place: PlaceDataType) => {
        const { name, categories, x, y } = place;
        selectedMarkers[status].push(
          setMarkerOnMap(
            'selected',
            x,
            y,
            name,
            getMapSelectedSymbol(getSymbol(categories), status)
          )
        );
      });
    });
    setAllSelectedMarkers(selectedMarkers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesData, getSymbol, setMarkerOnMap]);

  useEffect(() => {
    const newRenderData: PlaceDataType[] = _.cloneDeep(placesData);
    setMarkerNamesOnMap(
      newRenderData
        .filter(
          (place: PlaceDataType) =>
            selectedCategories === '전체' ||
            !_.isEmpty(
              _.intersection(
                place.categories.map((category: CategoryType) => category.type),
                selectedCategories
              )
            )
        )
        .map((place: PlaceDataType) => place.name)
    );
  }, [placesData, selectedCategories]);

  useEffect(() => {
    if (drawerStatus.expanded !== 'removed') return;
    overlay?.setMap(null);
    allSelectedMarkers[locationStatus] &&
      allSelectedMarkers[locationStatus].forEach((marker: any) => marker.setMap(null));
  }, [drawerStatus.expanded, allSelectedMarkers, locationStatus]);

  useEffect(() => {
    if (!kakaoMap) return;
    allMarkers.forEach((marker: any) => {
      if (!markerNamesOnMap.includes(marker.Gb) || marker.Gb === placeName) {
        marker.setMap(null);
        return;
      }
      marker.setMap(kakaoMap);
    });
    allSelectedMarkers[locationStatus] &&
      allSelectedMarkers[locationStatus].forEach((marker: any) => {
        if (marker.Gb !== placeName) {
          marker.setMap(null);
          return;
        }
        if (locationData?.name !== placeName) return;
        marker.setMap(kakaoMap);
      });
  }, [
    allMarkers,
    locationStatus,
    allSelectedMarkers,
    markerNamesOnMap,
    locationData,
    placeName,
    kakaoMap,
  ]);

  useEffect(() => {
    if (!kakaoMap || !['expanded', 'appeared'].includes(drawerStatus.expanded)) return;
    setMapCenter();
  }, [kakaoMap, drawerStatus.expanded, setMapCenter]);

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
