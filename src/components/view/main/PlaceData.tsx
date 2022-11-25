import { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { PlaceCard } from 'components/common';
import { placeDataType } from 'types/typeBundle';
import ScrollContainer from 'react-indiana-drag-scroll';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px 20px 35px',
    gap: 10,
  },
  listTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  chipsWrap: {
    display: 'flex',
    margin: '16px 0 20px',
    height: 33,
    gap: 10,
    cursor: 'pointer',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #d9d9d9',
    borderRadius: 29,
    padding: '8px 12px',
    whiteSpace: 'nowrap',
  },
  selectedChip: {
    border: '2px solid #000',
  },
  subHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  subLeft: {
    fontSize: 14,
    fontWeight: 500,
  },
  subLength: {
    marginLeft: 5,
    fontWeight: 700,
  },
  select: {
    '& div': {
      fontSize: 14,
      fontWeight: 400,
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
      <h1 className={classes.listTitle}>List Title</h1>
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
        <Select className={classes.select} onChange={handleChangeSelect} value={placeOrder}>
          {['복잡한 순', '여유로운 순', '인기 순'].map((menu: string, idx: number) => (
            <MenuItem key={`menu-${idx}`} className={classes.menuItem} value={menu} dense>
              {menu}
            </MenuItem>
          ))}
        </Select>
      </div>
      {placeData.map((place: placeDataType, idx: number) => (
        <PlaceCard key={`place-card-${idx}`} place={place} />
      ))}
    </div>
  );
};

export default PlaceData;
