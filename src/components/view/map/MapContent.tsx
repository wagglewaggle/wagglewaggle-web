import { useEffect, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import defaultPhoto from 'assets/icons/register/default-photo.png';

const MapContent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { UserNavigatorStore } = useStore().MobxStore;

  const getKakaoMap = useCallback(() => {
    const [latitude, longitude] = UserNavigatorStore.currentLocation;
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 5,
      });
      const markerSize = new window.kakao.maps.Size(35, 35);
      const marker = new window.kakao.maps.Marker({
        image: new window.kakao.maps.MarkerImage(defaultPhoto, markerSize),
        position: new window.kakao.maps.LatLng(latitude, longitude),
      });
      marker.setMap(map);
    });
  }, [UserNavigatorStore.currentLocation]);

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
