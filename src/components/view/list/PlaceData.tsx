import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Select, MenuItem, SelectChangeEvent, styled } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard, Footer } from 'components/common';
import { useStore } from 'stores';
import { CategoryType, PlaceDataType, ScreenType } from 'types/typeBundle';
import { palette } from 'constants/';
import { initPlaceData } from 'util/';
import _ from 'lodash';
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
      width: '100%',
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
}

const PlaceData = observer((props: propsType) => {
  const { placeData } = props;
  const [renderData, setRenderData] = useState<PlaceDataType[]>([]);
  const classes = useStyles();
  const { LocationStore, ScreenSizeStore, ThemeStore, CategoryStore } = useStore().MobxStore;
  const { selectedCategories } = CategoryStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleChangeSelect = (e: SelectChangeEvent<unknown>) => {
    const selectedOrder = e.target.value;
    LocationStore.setCurrentPlaceOrder(selectedOrder as '복잡한 순' | '여유로운 순');
    initPlaceData(selectedOrder === '복잡한 순');
  };

  useEffect(() => {
    setRenderData(placeData);
  }, [placeData]);

  useEffect(() => {
    setRenderData(
      _.cloneDeep(placeData).filter(
        (place: PlaceDataType) =>
          selectedCategories === '전체' ||
          !_.isEmpty(
            _.intersection(
              place.categories.map((category: CategoryType) => category.type),
              selectedCategories
            )
          )
      )
    );
  }, [placeData, selectedCategories]);

  return (
    <Wrap>
      <SubHeader>
        <SubHeaderLeft>
          장소
          <SubHeaderLength>{renderData.length}</SubHeaderLength>
        </SubHeaderLeft>
        <CustomSelect
          isDarkTheme={isDarkTheme}
          onChange={handleChangeSelect}
          value={LocationStore.currentPlaceOrder}
          SelectDisplayProps={{ style: { paddingRight: '24px' } }}
          IconComponent={(props) => <DownIcon {...props} />}
          MenuProps={{
            classes: { root: classes.menu },
            transformOrigin: { vertical: 0, horizontal: 92.5 },
            sx: {
              '& .MuiPaper-root': {
                width: 'fit-content',
                color: palette.grey[isDarkTheme ? 400 : 500],
                backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
              },
              '& .Mui-selected': {
                color: isDarkTheme ? palette.white : palette.black,
                backgroundColor: 'transparent !important',
              },
            },
          }}
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
  margin: '0 24px 72px',
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
