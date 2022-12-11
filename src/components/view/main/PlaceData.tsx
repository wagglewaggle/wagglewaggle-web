import { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent, Icon } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ScrollContainer from 'react-indiana-drag-scroll';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';
import { palette } from 'constants/palette';
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
  menuItem: {
    fontSize: 14,
    fontWeight: 400,
  },
  placesWrap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 476px), 1fr))',
    justifyContent: 'space-between',
    columnGap: 24,
    minWidth: 'fit-content',
  },
}));

interface propsType {
  placeData: placeDataType[];
}

const PlaceData = (props: propsType) => {
  const { placeData } = props;
  const [placeOrder, setPlaceOrder] = useState<string>('복잡한 순');
  const [selectedTitle, setSelectedTitle] = useState<string>('전체');
  const classes = useStyles();
  const DUMMY_CHIPS: string[] = ['전체', '한강 공원', '백화점', '크리스마스 축제'];

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
      <div className={classes.placesWrap}>
        {placeData.map((place: placeDataType, idx: number) => (
          <PlaceCard key={`place-card-${idx}`} place={place} />
        ))}
      </div>
    </div>
  );
};

export default PlaceData;
