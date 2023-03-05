import { useEffect, useCallback, useRef, useMemo } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { PlaceDataType, CategoryType } from 'types/typeBundle';
import { palette, symbols } from 'constants/';
import defaultPhoto from 'assets/icons/register/default-photo.png';

const MapContent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const primaryCategories = useMemo(() => ['한강', '공원', '궁궐'], []);
  const { UserNavigatorStore, CustomDrawerStore } = useStore().MobxStore;

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
    markerImage: string
  ) => {
    const markerSize = variant === 'profile' ? 35 : 24;
    const kakaoMarkerSize = new window.kakao.maps.Size(markerSize, markerSize);
    const marker = new window.kakao.maps.Marker({
      image: new window.kakao.maps.MarkerImage(markerImage, kakaoMarkerSize),
      position: new window.kakao.maps.LatLng(lat + 0.0003, lng),
      title: name,
    });
    marker.setMap(map);
  };

  const getOpacityCircleOnMap = (lat: number, lng: number) => {
    return new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(lat, lng),
      radius: 10000000,
      strokeWeight: 1,
      strokeColor: palette.white,
      strokeOpacity: 0.4,
      fillColor: palette.white,
      fillOpacity: 0.4,
    });
  };

  const getKakaoMap = useCallback(() => {
    const [latitude, longitude] = UserNavigatorStore.currentLocation;
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 5,
      });
      CustomDrawerStore.placeData.forEach((place: PlaceDataType) => {
        const { name, categories, x, y } = place;
        setMarkerOnMap('place', x, y, map, name, symbols[getSymbol(categories)]);
      });
      setMarkerOnMap('profile', latitude, longitude, map, '와글와글', defaultPhoto);
      getOpacityCircleOnMap(latitude, longitude).setMap(map);
    });
  }, [CustomDrawerStore.placeData, UserNavigatorStore.currentLocation, getSymbol]);

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);

    mapScript.addEventListener('load', getKakaoMap);
    return () => mapScript.removeEventListener('load', getKakaoMap);
  }, [getKakaoMap]);

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
  transform: 'translateY(3px)',
});
