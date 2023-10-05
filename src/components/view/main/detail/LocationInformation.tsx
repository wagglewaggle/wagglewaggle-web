import { useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import { palette, geometry, urlPaths, locationNames } from 'constants/';
import { LocationDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import navigationIcon from 'assets/icons/navigation-icon.svg';
import exclamationIcon from 'assets/icons/exclamation-icon.svg';

declare global {
  interface Window {
    kakao: any;
  }
}

interface propsType {
  locationData: LocationDataType | null;
}

const LocationInformation = observer((props: propsType) => {
  const { locationData } = props;
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [appearMapInfo, setAppearMapInfo] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

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
    if (!locationData) return null;
    const locationName = locationData.name;
    if (!geometry[locationName]?.coordinates) return null;
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
    const polygon = new window.kakao.maps.Polygon({
      path: polygonPath,
      strokeWeight: 1,
      strokeColor: palette.violet,
      strokeOpacity: 1,
      strokeStyle: 'solid',
      fillColor: palette.violet,
      fillOpacity: 0.5,
    });
    return polygon;
  }, [locationData]);

  const getAddress = (lng: number, lat: number) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(
      lng,
      lat,
      (result: { address: { address_name: string } }[], status: 'OK' | 'ZERO_RESULT') => {
        setLocationAddress(status === 'OK' ? result[0]?.address?.address_name : null);
      }
    );
  };

  const getKakaoMap = useCallback(() => {
    if (!locationData) return;
    const center: number[] = [locationData.x, locationData.y];
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
      const polygon = highlightMap();
      if (polygon) {
        polygon.setMap(map);
        setAppearMapInfo(true);
      }
      const centerCoords = map.getCenter();
      getAddress(centerCoords.getLng(), centerCoords.getLat());
    });
  }, [highlightMap, locationData]);

  const handleNavigationClick = () => {
    window.open(
      `https://place.map.kakao.com/${
        urlPaths[locationNames[locationData?.name || ''] || locationData?.name || '']
      }`,
      '_blank'
    );
  };

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(mapScript);

    mapScript.addEventListener('load', getKakaoMap);
    return () => mapScript.removeEventListener('load', getKakaoMap);
  }, [locationData, getKakaoMap]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <Header>위치 정보</Header>
      <MapWrap isDarkTheme={isDarkTheme}>
        <Map ref={mapRef} />
        <Description onClick={handleNavigationClick}>
          <TextArea>
            <Name>{locationNames[locationData?.name || ''] || locationData?.name}</Name>
            <Address isDarkTheme={isDarkTheme}>{locationAddress || ''}</Address>
          </TextArea>
          <CustomIconButton isDarkTheme={isDarkTheme}>
            <NavigationIcon src={navigationIcon} alt='navigation' />
          </CustomIconButton>
        </Description>
      </MapWrap>
      {appearMapInfo && (
        <InfoWrap isDarkTheme={isDarkTheme}>
          <img src={exclamationIcon} alt='exclamation' />
          장소 혼잡도는 보라색으로 표시된 영역까지만 통계되었습니다.
        </InfoWrap>
      )}
    </Wrap>
  );
});

export default LocationInformation;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: 24,
  marginTop: 8,
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
}));

const Header = styled('div')({
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
});

const MapWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 4,
  margin: 24,
  width: '100%',
  height: 212,
  backgroundColor: palette.grey[isDarkTheme ? 600 : 100],
}));

const Map = styled('div')({
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  width: '100%',
  height: 144,
});

const Description = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  padding: '0 16px',
  cursor: 'pointer',
});

const TextArea = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  fontSize: 14,
  lineHeight: '20px',
});

const Name = styled('div')({
  fontWeight: 600,
});

const Address = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  color: palette.grey[isDarkTheme ? 400 : 500],
  fontWeight: 400,
}));

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  border: `1px solid ${isDarkTheme ? palette.white : palette.black}`,
  padding: '3px',
  '& img': {
    filter: isDarkTheme ? 'none' : 'invert(1)',
  },
}));

const NavigationIcon = styled('img')({
  width: 16,
  height: 16,
});

const InfoWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  width: '100%',
  color: palette.grey[isDarkTheme ? 400 : 500],
  fontSize: 12,
  fontWeight: 500,
  gap: 4,
}));
