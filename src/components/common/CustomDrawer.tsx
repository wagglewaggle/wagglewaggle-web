import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Rnd, ResizableDelta } from 'react-rnd';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import SearchInput from './SearchInput';
import { useStore } from 'stores';
import { palette } from 'constants/';

const CustomDrawer = observer(() => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { ThemeStore, CustomDrawerStore, LocationStore, ScreenSizeStore } = useStore().MobxStore;
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const { open, includesInputBox, variant } = CustomDrawerStore;
  const FULL_HEIGHT = ScreenSizeStore.screenHeight;
  const EXPANDED_HEIGHT =
    ScreenSizeStore.screenHeight - (ScreenSizeStore.screenType === 'mobile' ? 256 : 456);
  const APPEARED_HEIGHT = 196;
  const [pullerDisabled, setPullerDisabled] = useState<boolean>(false);
  const [buttonName, setButtonName] = useState<string | null>(null);
  const [dragHeight, setDragHeight] = useState<number>(APPEARED_HEIGHT);
  const [expanded, setExpanded] = useState<'appeared' | 'expanded' | 'full'>('appeared');
  const eventFunctions: { [key: string]: () => void } = {};

  const handleClose = () => {
    navigate(`/${variant}`);
    CustomDrawerStore.closeDrawer();
    CustomDrawerStore.setIncludesInput(true);
    LocationStore.setLocationData(null);
  };

  const onResizeStart = () => {};

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    dir: string,
    ref: Element,
    delta: ResizableDelta
  ) => {
    const { height } = delta;
    if (height === 0) {
      if (!buttonName) return;
      eventFunctions[buttonName]();
      return;
    }

    const isExpanded = height > 0;
    if (expanded === 'appeared') {
      if (!isExpanded) {
        handleClose();
        return;
      }
      setExpanded('expanded');
      setDragHeight(EXPANDED_HEIGHT);
    }
    if (expanded === 'expanded') {
      setExpanded(isExpanded ? 'full' : 'appeared');
      setDragHeight(isExpanded ? FULL_HEIGHT : APPEARED_HEIGHT);
    }
    if (expanded === 'full') {
      setExpanded(isExpanded ? 'full' : 'expanded');
      setDragHeight(isExpanded ? FULL_HEIGHT : EXPANDED_HEIGHT);
    }
  };

  useEffect(() => {
    setDragHeight(APPEARED_HEIGHT);
    setExpanded('appeared');
  }, []);

  useEffect(() => {
    setPullerDisabled(dragHeight !== APPEARED_HEIGHT);
  }, [dragHeight]);

  useEffect(() => {
    if (!drawerRef?.current?.childNodes) return;
    (drawerRef.current.childNodes[2] as HTMLDivElement).scrollTo(0, 0);
  }, [search]);

  useEffect(() => {
    if (!open || includesInputBox) return;
    const pathnameArr = pathname.split('/');
    pathnameArr[1] = 'map';
    navigate(`${pathnameArr.join('/')}${search}`);
  }, [open, includesInputBox, pathname, search, navigate]);

  return (
    <>
      {CustomDrawerStore.open && (
        <CustomRnd
          isDarkTheme={isDarkTheme}
          position={{ x: 0, y: ScreenSizeStore.screenHeight - dragHeight }}
          resizeHandleStyles={{
            top: {
              height: dragHeight,
              cursor: 'grab',
              top: 0,
              backgroundColor: palette.transparent,
            },
            topLeft: { display: 'none' },
            topRight: { display: 'none' },
            bottomLeft: { display: 'none' },
            bottomRight: { display: 'none' },
            left: { display: 'none' },
            right: { display: 'none' },
            bottom: { display: 'none' },
          }}
          resizeHandleComponent={{
            top: (
              <>
                {!pullerDisabled && (
                  <Puller isDarkTheme={isDarkTheme}>
                    <PullerChip />
                  </Puller>
                )}
                {CustomDrawerStore.includesInputBox && <SearchInput />}
                {CustomDrawerStore.drawerComponent}
              </>
            ),
          }}
          maxHeight={FULL_HEIGHT}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          size={{ width: ScreenSizeStore.screenWidth, height: dragHeight }}
        />
      )}
    </>
  );
});

export default CustomDrawer;

const CustomRnd = styled(Rnd)({
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: 'calc(100% - 2px)',
  backgroundColor: palette.transparent,
  overflow: 'hidden',
  zIndex: 10,
});

const PullerChip = styled('div')({
  borderRadius: 12,
  width: 48,
  height: 4,
  backgroundColor: palette.grey[300],
});

const Puller = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  height: 16,
  backgroundColor: isDarkTheme ? palette.black : palette.white,
}));
