import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Box, Select, MenuItem, SelectChangeEvent, Theme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PlaceCard, Footer } from 'components/common';
import { useStore } from 'stores';
import { categoryType, placeDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import { ReactComponent as DownIcon } from 'assets/icons/down-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px 24px 72px',
    minHeight: 'calc(100vh - 148px)',
  },
  chipsWrap: {
    display: 'flex',
    padding: '16px 0',
    height: 32,
    gap: 10,
    cursor: 'pointer',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 29,
    padding: '8px 12px',
    whiteSpace: 'nowrap',
    fontSize: 14,
    fontWeight: 600,
  },
  darkChip: {
    border: `2px solid ${palette.grey[600]}`,
    color: palette.grey[400],
  },
  lightChip: {
    border: `2px solid ${palette.grey[300]}`,
    color: palette.grey[500],
  },
  subHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '16px 0',
  },
  subLeft: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 600,
  },
  subLength: {
    marginLeft: 5,
  },
  select: {
    '& div': {
      fontSize: 14,
      fontWeight: 600,
    },
    '& span': {
      transform: 'translateX(10px)',
    },
    '& svg': {
      right: 0,
      width: 16,
      height: 16,
    },
    '& fieldset': {
      display: 'none',
    },
    '& .MuiSelect-select': {
      padding: 0,
    },
  },
  menu: {
    marginTop: 8,
    '& ul': {
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      margin: '20px 24px',
      gap: 4,
    },
    '& li': {
      padding: '0 5px',
      width: 96,
    },
    '& .MuiPaper-root': {
      display: 'flex',
      alignItems: 'center',
      width: 144,
      height: 'auto',
      color: palette.grey[400],
      backgroundColor: palette.grey[700],
    },
  },
  placesWrap: {
    display: 'grid',
    justifyContent: 'space-between',
    columnGap: 24,
    minWidth: 'fit-content',
  },
}));

interface propsType {
  placeData: placeDataType[];
  handlePlaceDataChange: (newPlaceData: placeDataType[]) => void;
}

const PlaceData = observer((props: propsType) => {
  const { placeData, handlePlaceDataChange } = props;
  const [renderData, setRenderData] = useState<placeDataType[]>([]);
  const [placeOrder, setPlaceOrder] = useState<string>('복잡한 순');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const classes = useStyles();
  const { ScreenSizeStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const CHIPS: string[] = [
    '전체',
    '크리스마스 핫플',
    '쇼핑몰',
    '공원',
    '골목 및 거리',
    '지하철',
    '궁궐',
    '테마파크',
    '마을',
    '한강',
  ];
  const PLACE_BOX_STYLE: { gridTemplateColumns: string } = {
    gridTemplateColumns:
      ScreenSizeStore.screenType === 'mobile' ? '100%' : 'repeat(auto-fit, minmax(348px, 1fr))',
  };
  const SELECTED_CHIP_STYLE: { border: string; color: string; backgroundColor: string } = {
    border: `2px solid ${isDarkTheme ? palette.white : palette.black}`,
    color: isDarkTheme ? palette.black : palette.white,
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };

  const handleClickChip = (chip: string) => {
    setSelectedCategory(chip);
  };

  const handleChangeSelect = (e: SelectChangeEvent) => {
    setPlaceOrder(e.target.value);
    const statusArr: string[] = [
      'VERY_RELAXATION',
      'RELAXATION',
      'NORMAL',
      'CROWDED',
      'VERY_CROWDED',
    ];
    handlePlaceDataChange(
      placeData.sort((prev: placeDataType, next: placeDataType) => {
        const prevLevel = statusArr.indexOf(prev.populations[0].level);
        const nextLevel = statusArr.indexOf(next.populations[0].level);
        if (prevLevel > nextLevel) return e.target.value === '복잡한 순' ? -1 : 1;
        else if (nextLevel > prevLevel) return e.target.value === '복잡한 순' ? 1 : -1;
        return 0;
      })
    );
  };

  useEffect(() => {
    setRenderData(placeData);
  }, [placeData]);

  useEffect(() => {
    const newRenderData: placeDataType[] = JSON.parse(JSON.stringify(placeData));
    setRenderData(
      newRenderData.filter((place: placeDataType) => {
        const categories: string[] = place.categories.map(
          (category: categoryType) => category.type
        );
        return selectedCategory === '전체' || categories.includes(selectedCategory);
      })
    );
  }, [placeData, selectedCategory]);

  return (
    <div className={classes.wrap}>
      <ScrollContainer className={classes.chipsWrap} horizontal>
        {CHIPS.map((chip: string, idx: number) => (
          <Box
            key={`chip-${idx}`}
            className={`${classes.chip} ${isDarkTheme ? classes.darkChip : classes.lightChip}`}
            sx={selectedCategory === chip ? SELECTED_CHIP_STYLE : {}}
            onClick={() => handleClickChip(chip)}
          >
            {chip}
          </Box>
        ))}
      </ScrollContainer>
      <div className={classes.subHeader}>
        <span className={classes.subLeft}>
          장소
          <span className={classes.subLength}>{renderData.length}</span>
        </span>
        <Select
          className={classes.select}
          onChange={handleChangeSelect}
          value={placeOrder}
          SelectDisplayProps={{ style: { paddingRight: '24px' } }}
          MenuProps={{
            classes: { root: classes.menu },
            sx: {
              '& .Mui-selected': {
                color: isDarkTheme ? palette.white : palette.black,
                backgroundColor: 'transparent !important',
              },
            },
          }}
          IconComponent={(props) => <DownIcon {...props} />}
          sx={{
            color: isDarkTheme ? palette.white : palette.black,
          }}
        >
          {['복잡한 순', '여유로운 순'].map((menu: string, idx: number) => (
            <MenuItem key={`menu-${idx}`} sx={{ fontWeight: 600 }} value={menu} dense>
              {menu}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Box className={classes.placesWrap} sx={PLACE_BOX_STYLE}>
        {renderData.map((place: placeDataType, idx: number) => (
          <PlaceCard key={`place-card-${idx}`} place={place} />
        ))}
      </Box>
      <Footer />
    </div>
  );
});

export default PlaceData;
