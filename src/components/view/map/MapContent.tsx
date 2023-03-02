import { useEffect, useCallback, useRef } from 'react';
import { styled } from '@mui/material';

const MapContent = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getKakaoMap = useCallback(() => {
    const center: number[] = [37.625638, 127.038941];
    const [latitude, longitude] = center;
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 7,
      });
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(latitude, longitude),
      });
      marker.setMap(map);
    });
  }, []);

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

export default MapContent;

const Wrap = styled('div')({
  width: '100%',
  height: 'calc(100vh - 104px)',
});

const Map = styled('div')({
  width: '100%',
  height: '100%',
  transform: 'translateY(3px)',
});
