import { Fragment } from 'react';
import { Drawer } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/';

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

const CustomDrawer = (props: propsType) => {
  const { open, searchInput = <Fragment />, component, onClose } = props;
  const classes = useStyles();

  return (
    <Drawer
      className={classes.wrap}
      open={open}
      anchor='right'
      onClose={onClose}
      transitionDuration={0}
    >
      {searchInput}
      {component}
    </Drawer>
  );
};

export default CustomDrawer;
