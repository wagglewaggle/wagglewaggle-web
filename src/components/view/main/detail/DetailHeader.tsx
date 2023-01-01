import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Box, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import lottie from 'lottie-web';
import { PlaceStatus } from 'components/common';
import { palette, locationNames, bgPaths } from 'constants/';
import { categoryType, locationDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import DetailLottie from 'assets/lottie/Detail.json';
import leftIcon from 'assets/icons/left-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px',
    height: 448,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'center',
    overflowX: 'hidden',
    '& svg': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '767px !important',
      height: '432px !important',
    },
  },
  buttonArea: {
    padding: '12px 0',
    zIndex: 1,
    '& button': {
      padding: 0,
      width: 32,
      height: 32,
      justifyContent: 'flex-start',
    },
  },
  categoryName: {
    margin: '8px 0',
    fontSize: 12,
    fontWeight: 500,
  },
  statusWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    whiteSpace: 'pre-line',
    lineHeight: '32px',
  },
  status: {
    fontSize: 24,
    fontWeight: 600,
  },
}));

interface propsType {
  locationData: locationDataType | null;
}

const DetailHeader = observer((props: propsType) => {
  const { locationData } = props;
  const [categories, setCategories] = useState<string>('');
  const [bgPath, setBgPath] = useState<string>('');
  const lottieContainer = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const { LocationStore, ThemeStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleBackClick = () => {
    navigate('/main');
  };

  useEffect(() => {
    if (!lottieContainer.current) return;
    lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: DetailLottie,
    });
  }, []);

  useEffect(() => {
    if (!bgPaths[locationData?.name || '']) return;
    setBgPath(
      `url(${require(`assets/detailBg/${ThemeStore.theme}/${
        bgPaths[locationData?.name || ''] || 'Street'
      }/${locationData?.populations[0].level || 'NORMAL'}.png`)})`
    );
  }, [ThemeStore.theme, locationData?.name, locationData?.populations]);

  useEffect(() => {
    if (!locationData?.name || !LocationStore.categories[locationData.name]) return;
    setCategories(
      LocationStore.categories[locationData.name]
        .map((category: categoryType) => category.type)
        .join(', ')
    );
  }, [locationData?.name, LocationStore.categories]);

  return (
    <Box
      className={classes.wrap}
      ref={lottieContainer}
      sx={
        bgPath === ''
          ? undefined
          : {
              backgroundImage: bgPath,
            }
      }
    >
      <div className={classes.buttonArea}>
        <IconButton onClick={handleBackClick} sx={{ filter: isDarkTheme ? 'none' : 'invert(1)' }}>
          <img src={leftIcon} alt='left' />
        </IconButton>
      </div>
      <Box className={classes.categoryName} sx={{ color: palette.grey[isDarkTheme ? 400 : 500] }}>
        {categories}
      </Box>
      <div className={classes.statusWrap}>
        <div className={classes.status}>
          {`지금 ${locationNames[locationData?.name || ''] || locationData?.name || ''}에
          사람이 `}
          <PlaceStatus
            status={locationData?.populations[0].level || undefined}
            comments={{
              VERY_RELAXATION: '거의 없어요.',
              RELAXATION: '조금 있어요.',
              NORMAL: '적당해요.',
              CROWDED: '많아요.',
              VERY_CROWDED: '너무 많아요.',
            }}
          />
        </div>
      </div>
    </Box>
  );
});

export default DetailHeader;
