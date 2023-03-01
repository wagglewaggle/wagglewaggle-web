import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Select, MenuItem, SelectChangeEvent, styled } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard, Footer, CustomChips } from 'components/common';
import { useStore } from 'stores';
import { CategoryType, PlaceDataType, ScreenType } from 'types/typeBundle';
import { palette } from 'constants/';
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

interface propsType {
  placeData: PlaceDataType[];
  handlePlaceDataChange: (newPlaceData: PlaceDataType[]) => void;
}

const PlaceData = observer((props: propsType) => {
  const { placeData, handlePlaceDataChange } = props;
  const [renderData, setRenderData] = useState<PlaceDataType[]>([]);
  const [placeOrder, setPlaceOrder] = useState<string>('복잡한 순');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const classes = useStyles();
  const { ScreenSizeStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleClickChip = (chip: string) => {
    setSelectedCategory(chip);
  };

  const handleChangeSelect = (e: SelectChangeEvent<unknown>) => {
    setPlaceOrder(e.target.value as string);
    const statusArr: string[] = [
      'VERY_RELAXATION',
      'RELAXATION',
      'NORMAL',
      'CROWDED',
      'VERY_CROWDED',
    ];
    handlePlaceDataChange(
      placeData.sort((prev: PlaceDataType, next: PlaceDataType) => {
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
    const newRenderData: PlaceDataType[] = JSON.parse(JSON.stringify(placeData));
    setRenderData(
      newRenderData.filter((place: PlaceDataType) => {
        const categories: string[] = place.categories.map(
          (category: CategoryType) => category.type
        );
        return selectedCategory === '전체' || categories.includes(selectedCategory);
      })
    );
  }, [placeData, selectedCategory]);

  return (
    <Wrap>
      <CustomChips selectedCategory={selectedCategory} handleClickChip={handleClickChip} />
      <SubHeader>
        <SubHeaderLeft>
          장소
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
  gridTemplateColumns: screenType === 'mobile' ? '100%' : 'repeat(auto-fit, minmax(348px, 1fr))',
}));
