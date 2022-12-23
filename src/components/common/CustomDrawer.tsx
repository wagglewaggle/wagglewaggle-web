import { Fragment, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Drawer } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { palette } from 'constants/';

const useStyles = makeStyles(() => ({
  wrap: {
    '& .MuiPaper-root': {
      backgroundColor: palette.grey[700],
      overflowX: 'hidden',
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
  const drawerRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (!drawerRef?.current?.childNodes) return;
    (drawerRef.current.childNodes[2] as HTMLDivElement).scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerRef?.current, location.search]);

  return (
    <Drawer
      className={classes.wrap}
      ref={drawerRef}
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
