import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material';
import { CustomSearchBox, CustomChips, NavigationIcons } from 'components/common';

const Map = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/map');
  };

  const handleSearchClick = () => {
    navigate('/map/search');
  };

  const handleClickChip = (chip: string) => {
    setSelectedCategory(chip);
  };

  return (
    <Wrap>
      <CustomSearchBox navigateToHome={navigateToHome} handleSearchClick={handleSearchClick} />
      <ChipsWrap>
        <CustomChips selectedCategory={selectedCategory} handleClickChip={handleClickChip} />
      </ChipsWrap>
      dadada
      <NavigationIcons />
    </Wrap>
  );
};

export default Map;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  zIndex: 2,
  overflowX: 'hidden',
});

const ChipsWrap = styled('div')({
  padding: '0 28px',
  margin: '20px 0',
  width: 'calc(100% - 48px)',
  boxShadow: '0 6px 4px -4px rgba(0, 0, 0, 0.3)',
  transform: 'translateX(-4px)',
});
