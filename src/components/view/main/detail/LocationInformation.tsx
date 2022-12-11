import { useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/palette';
import navigationIcon from 'assets/icons/navigation-icon.svg';

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
    border: '1px solid transparent',
    borderRadius: 4,
    margin: 24,
    width: '100%',
    height: 212,
    backgroundColor: palette.grey[600],
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
  },
  textArea: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    fontSize: 14,
  },
  name: {
    color: palette.white,
    fontWeight: 600,
  },
  address: {
    color: palette.grey[400],
    fontWeight: 400,
  },
  navigationIcon: {
    width: 16,
    height: 16,
  },
}));

declare global {
  interface Window {
    kakao: any;
  }
}

const LocationInformation = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_APP_KEY}&autoload=false`;
    document.head.appendChild(mapScript);

    const getKakaoMap = () => {
      // 임시 dummy 좌표
      const latitude: number = 33.450701;
      const longitude: number = 126.570667;
      window.kakao.maps.load(() => {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        });
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude, longitude),
        });
        marker.setMap(map);
      });
    };

    mapScript.addEventListener('load', getKakaoMap);
    return () => mapScript.removeEventListener('load', getKakaoMap);
  }, []);

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>위치 정보</div>
      <div className={classes.mapWrap}>
        <div className={classes.map} ref={mapRef} />
        <div className={classes.description}>
          <div className={classes.textArea}>
            <div className={classes.name}>카카오 스페이스닷원</div>
            <div className={classes.address}>제주특별자치도 제주시 첨단로 242</div>
          </div>
          <IconButton sx={{ border: `1px solid ${palette.white}`, padding: '3px' }}>
            <img className={classes.navigationIcon} src={navigationIcon} alt='navigation' />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default LocationInformation;
