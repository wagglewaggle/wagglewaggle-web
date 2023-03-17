import { useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';

const ReviewWriteButton = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { ReviewStore } = useStore().MobxStore;

  const handleClick = () => {
    navigate(`/review/write${search}`);
  };

  return (
    <>
      {ReviewStore.writeReviewButtonVisible && (
        <Wrap onClick={handleClick}>
          <ChatIcon />
          리뷰쓰기
        </Wrap>
      )}
    </>
  );
};

export default observer(ReviewWriteButton);

const Wrap = styled('div')({
  position: 'fixed',
  left: 'calc(50% + 144px)',
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
  transform: 'translateX(-50%)',
  zIndex: 100,
  gap: 4,
  '& svg': {
    width: 20,
    height: 20,
  },
  '& path': {
    fill: palette.white,
  },
});
