import { useState } from 'react';
import { observer } from 'mobx-react';
import { Box, Select, MenuItem, SelectChangeEvent, Icon } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PlaceCard } from 'components/common';
import { useStore } from 'stores';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/';
import downIcon from 'assets/icons/down-icon.svg';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px 24px 35px',
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
    border: `2px solid ${palette.grey[600]}`,
    borderRadius: 29,
    padding: '8px 12px',
    whiteSpace: 'nowrap',
    color: palette.grey[400],
    fontSize: 12,
    fontWeight: 500,
  },
  selectedChip: {
    border: `2px solid ${palette.white}`,
    color: palette.black,
    backgroundColor: palette.white,
  },
  subHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subLeft: {
    display: 'flex',
    alignItems: 'center',
    color: palette.white,
    fontSize: 18,
    fontWeight: 600,
  },
  subLength: {
    marginLeft: 5,
  },
  select: {
    '& div': {
      color: palette.grey[400],
      fontSize: 12,
      fontWeight: 500,
    },
    '& span': {
      transform: 'translateX(10px)',
    },
    '& fieldset': {
      display: 'none',
    },
    '& .MuiSelect-select': {
      padding: 0,
    },
  },
  menu: {
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
    '& .Mui-selected': {
      color: palette.white,
    },
  },
  menuItem: {
    fontSize: 14,
    fontWeight: 400,
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
}

const PlaceData = observer((props: propsType) => {
  const { placeData } = props;
  const [placeOrder, setPlaceOrder] = useState<string>('복잡한 순');
  const [selectedTitle, setSelectedTitle] = useState<string>('전체');
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;
  const DUMMY_CHIPS: string[] = ['전체', '한강 공원', '백화점', '크리스마스 축제'];
  const PLACE_BOX_STYLE: { gridTemplateColumns: string } = {
    gridTemplateColumns:
      ScreenSizeStore.screenType === 'mobile' ? '100%' : 'repeat(auto-fit, minmax(348px, 1fr))',
  };

  const handleClickChip = (chip: string) => {
    setSelectedTitle(chip);
  };

  const handleChangeSelect = (e: SelectChangeEvent) => {
    setPlaceOrder(e.target.value);
  };

  return (
    <div className={classes.wrap}>
      <ScrollContainer className={classes.chipsWrap} horizontal>
        {DUMMY_CHIPS.map((chip: string, idx: number) => (
          <div
            key={`chip-${idx}`}
            className={`${classes.chip} ${selectedTitle === chip && classes.selectedChip}`}
            onClick={() => handleClickChip(chip)}
          >
            {chip}
          </div>
        ))}
      </ScrollContainer>
      <div className={classes.subHeader}>
        <span className={classes.subLeft}>
          장소
          <span className={classes.subLength}>{placeData.length}</span>
        </span>
        <Select
          className={classes.select}
          onChange={handleChangeSelect}
          value={placeOrder}
          SelectDisplayProps={{ style: { paddingRight: '24px' } }}
          MenuProps={{ classes: { root: classes.menu } }}
          IconComponent={(props) => (
            <Icon {...props} sx={{ '& img': { width: '16px', height: '16px', opacity: 0.7 } }}>
              <img src={downIcon} alt='down-icon' />
            </Icon>
          )}
        >
          {['복잡한 순', '여유로운 순', '인기 순'].map((menu: string, idx: number) => (
            <MenuItem key={`menu-${idx}`} className={classes.menuItem} value={menu} dense>
              {menu}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Box className={classes.placesWrap} sx={PLACE_BOX_STYLE}>
        {placeData.map((place: placeDataType, idx: number) => (
          <PlaceCard key={`place-card-${idx}`} place={place} />
        ))}
      </Box>
    </div>
  );
});

export default PlaceData;
