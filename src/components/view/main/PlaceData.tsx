import { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { placeDataType } from 'types/typeBundle';
import ScrollContainer from 'react-indiana-drag-scroll';
import dummyImage from 'assets/dummy-image.png';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
    gap: 10,
  },
  placeCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    width: 'calc(100% - 20px)',
    height: 'fit-content',
    backgroundColor: '#d9d9d9',
  },
  placeLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  placeTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 500,
  },
  placeCategory: {
    marginLeft: 7,
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  placeStatus: {
    fontSize: 12,
    fontWeight: 500,
  },
  placeImage: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 46,
      height: 35,
    },
  },
  listTitle: {
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
      <div className={classes.listTitle}>List Title</div>
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
        <div key={`place-card-${idx}`} className={classes.placeCard}>
          <div className={classes.placeLeft}>
            <div className={classes.placeTitle}>
              <span className={classes.placeName}>{place.name}</span>
              <span className={classes.placeCategory}>{place.category}</span>
            </div>
            <div className={classes.placeStatus}>{place.status}</div>
          </div>
          <div className={classes.placeImage}>
            <img src={dummyImage} alt='home' />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaceData;
