import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { ReactComponent as MapIcon } from 'assets/icons/map-icon.svg';
import { ReactComponent as ListIcon } from 'assets/icons/list-icon.svg';
import { palette } from 'constants/';

type IconsType = 'map' | 'list';

const NavigationIcons = () => {
  const [focusedItem, setFocusedItem] = useState<IconsType>('map');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { CustomDrawerStore } = useStore().MobxStore;

  const handleMapButtonClick = () => {
    setFocusedItem('map');
    navigate('/map');
    CustomDrawerStore.setVariant('map');
    CustomDrawerStore.closeDrawer();
  };

  const handleListButtonClick = () => {
    setFocusedItem('list');
    navigate('/list');
    CustomDrawerStore.setVariant('list');
    CustomDrawerStore.closeDrawer();
  };

  useEffect(() => {
    if (pathname.includes('list')) {
      setFocusedItem('list');
      return;
    }
    setFocusedItem('map');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrap>
      <CustomButton variant='map' focused={focusedItem === 'map'} onClick={handleMapButtonClick}>
        <MapIcon />
      </CustomButton>
      <CustomButton variant='list' focused={focusedItem === 'list'} onClick={handleListButtonClick}>
        <ListIcon />
      </CustomButton>
    </Wrap>
  );
};

export default NavigationIcons;

const Wrap = styled('div')({
  position: 'fixed',
  left: '50%',
  bottom: 56,
  display: 'flex',
  filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))',
  cursor: 'pointer',
  transform: 'translateX(-50%)',
  zIndex: 10,
});

const CustomButton = styled('div', {
  shouldForwardProp: (prop: string) => !['variant', 'focused'].includes(prop),
})<{ variant: IconsType; focused: boolean }>(({ variant, focused }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTopLeftRadius: variant === 'map' ? 4 : 0,
  borderBottomLeftRadius: variant === 'map' ? 4 : 0,
  borderTopRightRadius: variant === 'map' ? 0 : 4,
  borderBottomRightRadius: variant === 'map' ? 0 : 4,
  width: 40,
  height: 40,
  backgroundColor: focused ? palette.violet : palette.grey[200],
  '& path': {
    fill: focused ? palette.white : palette.grey[400],
  },
}));
