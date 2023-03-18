import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';

const ReviewWriteButton = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { ReviewStore, ScreenSizeStore } = useStore().MobxStore;
  const pathnameArr = pathname.split('/');
  const placeIdx = pathnameArr[pathnameArr.length - 1];

  const handleClick = () => {
    navigate(`/review/write/${placeIdx}${search}`);
  };

  return (
    <>
      {ReviewStore.writeReviewButtonVisible && (
        <Wrap onClick={handleClick} screenWidth={ScreenSizeStore.screenWidth}>
          <ChatIcon />
          리뷰쓰기
        </Wrap>
      )}
    </>
  );
};

export default observer(ReviewWriteButton);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'screenWidth',
})<{ screenWidth: number }>(({ screenWidth }) => ({
  position: 'fixed',
  left: `calc(50% + ${screenWidth / 2 - 70}px)`,
  bottom: 58,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  width: 93,
  height: 36,
  color: palette.white,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  backgroundColor: palette.violet,
  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  zIndex: 100,
  transform: 'translateX(-50%)',
  gap: 4,
  '& svg': {
    width: 20,
    height: 20,
  },
  '& path': {
    fill: palette.white,
  },
}));
