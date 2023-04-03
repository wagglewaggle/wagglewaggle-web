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
  const { writeReviewButtonVisible, openReviewWritePage, reviewDetail } = ReviewStore;
  const isButtonHidden = !writeReviewButtonVisible || openReviewWritePage || !!reviewDetail;

  const handleClick = () => {
    ReviewStore.setEditOptions({
      editMode: false,
      content: '',
      requestUrl: '',
      type: 'review',
    });
    ReviewStore.setOpenReviewWritePage(true);
    const pathnameArr = pathname.split('/');
    pathnameArr.splice(1, 1, 'review');
    const reviewPagePath = pathnameArr.join('/');
    // history 객체 관련 뒤로가기 버튼 정상 동작을 위해 2번 navigate 함
    navigate(`${reviewPagePath}${search}`);
    navigate(`${reviewPagePath}${search}`);
  };

  return (
    <>
      {!isButtonHidden && (
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
  zIndex: 1210,
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
