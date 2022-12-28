import { useState, useEffect, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Box, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette, geometry, urlPaths, locationNames, locationRequestTypes } from 'constants/';
import { locationDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import navigationIcon from 'assets/icons/navigation-icon.svg';
import exclamationIcon from 'assets/icons/exclamation-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
    marginTop: 8,
    backgroundColor: palette.grey[700],
  },
  header: {
    width: '100%',
    fontSize: 18,
    fontWeight: 600,
  },
  mapWrap: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 4,
    margin: 24,
    width: '100%',
    height: 212,
  },
  map: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: '100%',
    height: 144,
  },
  description: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    padding: '0 16px',
    cursor: 'pointer',
  },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    fontSize: 14,
    lineHeight: '20px',
  },
  name: {
    fontWeight: 600,
  },
  navigationIcon: {
    width: 16,
    height: 16,
  },
  infoWrap: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    fontSize: 12,
    fontWeight: 500,
    gap: 4,
  },
}));

declare global {
  interface Window {
    kakao: any;
  }
}

interface propsType {
  locationData: locationDataType | null;
}

const LocationInformation = observer((props: propsType) => {
  const { locationData } = props;
  const [locationAddress, setLocationAddress] = useState<string | null>(null);
  const [appearMapInfo, setAppearMapInfo] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
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
    if (locationRequestTypes.skt.includes(locationNames[locationData.name] || locationData.name)) {
      return null;
    }
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
    <Box
      className={classes.wrap}
      sx={{
        backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
        '& path': {
          fill: isDarkTheme ? palette.white : palette.black,
        },
      }}
    >
      <div className={classes.header}>위치 정보</div>
      <Box
        className={classes.mapWrap}
        sx={{
          backgroundColor: palette.grey[isDarkTheme ? 600 : 100],
        }}
      >
        <div className={classes.map} ref={mapRef} />
        <div className={classes.description} onClick={handleNavigationClick}>
          <div className={classes.textArea}>
            <div className={classes.name}>
              {locationNames[locationData?.name || ''] || locationData?.name}
            </div>
            <Box
              sx={{
                color: palette.grey[isDarkTheme ? 400 : 500],
                fontWeight: 400,
              }}
            >
              {locationAddress || ''}
            </Box>
          </div>
          <IconButton
            sx={{
              border: `1px solid ${isDarkTheme ? palette.white : palette.black}`,
              padding: '3px',
              '& img': {
                filter: isDarkTheme ? 'none' : 'invert(1)',
              },
            }}
          >
            <img className={classes.navigationIcon} src={navigationIcon} alt='navigation' />
          </IconButton>
        </div>
      </Box>
      {appearMapInfo && (
        <Box
          className={classes.infoWrap}
          sx={{
            color: palette.grey[isDarkTheme ? 400 : 500],
          }}
        >
          <img src={exclamationIcon} alt='exclamation' />
          장소 혼잡도는 보라색으로 표시된 영역까지만 통계되었습니다.
        </Box>
      )}
    </Box>
  );
});

export default LocationInformation;
