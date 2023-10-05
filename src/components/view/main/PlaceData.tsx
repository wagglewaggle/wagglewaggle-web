import { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { Select, MenuItem, SelectChangeEvent, styled } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PlaceCard, Footer } from 'components/common';
import { useStore } from 'stores';
import { PlaceDataType, ScreenType } from 'types/typeBundle';
import { palette, chipIcons } from 'constants/';
import { filterPlaceCard } from 'util/';
import { request } from 'api/request';
import { ReactComponent as DownIcon } from 'assets/icons/down-icon.svg';

const useStyles = makeStyles(() => ({
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
    },
  },
}));

const PlaceData = observer(() => {
  const [renderData, setRenderData] = useState<PlaceDataType[]>([]);
  const [placeOrder, setPlaceOrder] = useState<string>('복잡한 순');
  const [selectedCategory, setSelectedCategory] = useState<string>('불꽃축제');
  const classes = useStyles();
  const [chips, setChips] = useState<string[]>([]);
  const { LocationStore, ScreenSizeStore, ThemeStore } = useStore().MobxStore;
  const { allPlaces } = LocationStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const SELECTED_CHIP_STYLE: { border: string; color: string; backgroundColor: string } = {
    border: `2px solid ${isDarkTheme ? palette.white : palette.black}`,
    color: isDarkTheme ? palette.black : palette.white,
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };

  const handleClickChip = (chip: string) => {
    setSelectedCategory(chip);
  };

  const sortChips = (prev: string, next: string) => {
    const primaryCategoryName = '불꽃축제';
    const secondaryCategoryName = '전체';
    if (prev === primaryCategoryName) return -1;
    if (next === primaryCategoryName) return 1;
    if (prev === secondaryCategoryName) return -1;
    if (next === secondaryCategoryName) return 1;
    if (prev > next) return 1;
    if (prev < next) return -1;
    return 0;
  };

  const getChips = useCallback(async () => {
    const response = await request.getCategory();
    setChips(
      ['전체', ...response?.data.list.map((ele: { type: string }) => ele.type)].sort(sortChips)
    );
  }, []);

  const filterCardsByCategory = useCallback(async () => {
    if (selectedCategory === '전체') {
      setRenderData(filterPlaceCard(allPlaces, placeOrder === '복잡한 순'));
      return;
    }
    const params = { populationSort: true, category: selectedCategory };
    const ktData = (await request.getKtPlaces(params)).data.list;
    const sktData = (await request.getSktPlaces(params)).data.list;
    setRenderData(filterPlaceCard([...ktData, ...sktData], placeOrder === '복잡한 순'));
  }, [selectedCategory, allPlaces, placeOrder]);

  const handleChangeSelect = (e: SelectChangeEvent<unknown>) => {
    setPlaceOrder(e.target.value as string);
    setRenderData(filterPlaceCard(renderData, placeOrder === '복잡한 순'));
  };

  useLayoutEffect(() => {
    if (chips.length > 0) return;
    getChips();
  }, [chips, getChips]);

  useEffect(() => {
    filterCardsByCategory();
  }, [selectedCategory, allPlaces, filterCardsByCategory]);

  return (
    <Wrap>
      <ChipsWrap horizontal>
        {chips.map((chip, idx) => (
          <Chip
            key={chip}
            isDarkTheme={isDarkTheme}
            selectedStyle={selectedCategory === chip ? SELECTED_CHIP_STYLE : {}}
            onClick={() => handleClickChip(chip)}
          >
            <img src={chipIcons[chip]} alt={chip} />
            {chip}
          </Chip>
        ))}
      </ChipsWrap>
      <SubHeader>
        <SubHeaderLeft>
          🔥 장소
          <SubHeaderLength>{renderData.length}</SubHeaderLength>
        </SubHeaderLeft>
        <CustomSelect
          isDarkTheme={isDarkTheme}
          onChange={handleChangeSelect}
          value={placeOrder}
          SelectDisplayProps={{ style: { paddingRight: '24px' } }}
          MenuProps={{
            classes: { root: classes.menu },
            sx: {
              '& .MuiPaper-root': {
                color: palette.grey[isDarkTheme ? 400 : 500],
                backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
              },
              '& .Mui-selected': {
                color: isDarkTheme ? palette.white : palette.black,
                backgroundColor: 'transparent !important',
              },
            },
          }}
          IconComponent={(props) => <DownIcon {...props} />}
        >
          {['복잡한 순', '여유로운 순'].map((menu: string, idx: number) => (
            <CustomMenuItem key={`menu-${idx}`} value={menu} dense>
              {menu}
            </CustomMenuItem>
          ))}
        </CustomSelect>
      </SubHeader>
      <PlacesWrap screenType={ScreenSizeStore.screenType}>
        {renderData.map((place: PlaceDataType, idx: number) => (
          <PlaceCard key={`place-card-${idx}`} place={place} />
        ))}
      </PlacesWrap>
      <Footer />
    </Wrap>
  );
});

export default PlaceData;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '20px 24px 72px',
  minHeight: 'calc(100vh - 148px)',
});

const ChipsWrap = styled(ScrollContainer)({
  display: 'flex',
  padding: '16px 0',
  height: 32,
  gap: 10,
  cursor: 'pointer',
});

const Chip = styled('div', {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'selectedStyle'].includes(prop),
})<{ isDarkTheme: boolean; selectedStyle: object }>(({ isDarkTheme, selectedStyle }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 29,
  padding: '8px 12px',
  whiteSpace: 'nowrap',
  fontSize: 14,
  fontWeight: 600,
  border: `1px solid ${palette.grey[isDarkTheme ? 600 : 300]}`,
  color: palette.grey[isDarkTheme ? 400 : 500],
  gap: '0.25rem',
  ...selectedStyle,
}));

const SubHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  margin: '16px 0',
});

const SubHeaderLeft = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 18,
  fontWeight: 600,
});

const SubHeaderLength = styled('div')({
  marginLeft: 5,
});

const CustomSelect = styled(Select, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  color: isDarkTheme ? palette.white : palette.black,
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
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
}));

const CustomMenuItem = styled(MenuItem)({
  fontWeight: 600,
});

const PlacesWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenType',
})<{ screenType: ScreenType }>(({ screenType }) => ({
  display: 'grid',
  justifyContent: 'space-between',
  columnGap: 24,
  minWidth: 'fit-content',
  gridTemplateColumns: screenType === 'mobile' ? '100%' : 'repeat(2, minmax(348px, 1fr))',
}));
