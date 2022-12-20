import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { Drawer } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/';
import { useStore } from 'stores';

const useStyles = makeStyles(() => ({
  wrap: {
    '& .MuiPaper-root': {
      backgroundColor: palette.grey[800],
    },
  },
}));

interface propsType {
  open: boolean;
  searchInput?: JSX.Element;
  component: JSX.Element;
  onClose: () => void;
}

const CustomDrawer = observer((props: propsType) => {
  const { open, searchInput = <Fragment />, component, onClose } = props;
  const classes = useStyles();
  const { ScreenSizeStore } = useStore().MobxStore;

  return (
    <Drawer
      className={classes.wrap}
      sx={{ width: ScreenSizeStore.screenType === 'mobile' ? '100%' : 'auto' }}
      open={open}
      anchor='right'
      onClose={onClose}
      transitionDuration={0}
    >
      {searchInput}
      {component}
    </Drawer>
  );
});

export default CustomDrawer;
