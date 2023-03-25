import { MouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, MenuItem, styled } from '@mui/material';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { palette } from 'constants/';

type PropsType = {
  anchorEl: null | HTMLElement;
  isMyReview: boolean;
  handleMenuClose: (e: MouseEvent) => void;
};

const HeaderSelectMenu = (props: PropsType) => {
  const { anchorEl, isMyReview, handleMenuClose } = props;
  const { ReviewStore, CustomDialogStore } = useStore().MobxStore;
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const selectItems = isMyReview ? ['수정하기', '삭제하기', '신고하기'] : ['신고하기'];

  const reportReview = () => {
    console.log('report');
  };

  const editReview = () => {
    ReviewStore.setEditOptions({
      editMode: true,
      content: ReviewStore.reviewDetail?.content ?? '',
    });
    const pathnameArr = pathname.split('/');
    pathnameArr.splice(2, 0, 'write');
    navigate(`${pathnameArr.join('/')}${search}`);
  };

  const onDeleteReview = async () => {
    const { reviewDetail } = ReviewStore;
    if (!reviewDetail) return;
    const response = await axiosRequest(
      'delete',
      `${reviewDetail.place.type}/${reviewDetail.place.idx}/review-post/${reviewDetail.idx}`
    );
    if (!response?.data) return;
    handleCloseDialog();
    ReviewStore.initReviews(reviewDetail.place.type as 'SKT' | 'KT', reviewDetail.place.idx);
    ReviewStore.setReviewDetail(null);
  };

  const handleCloseDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  const deleteReview = async () => {
    CustomDialogStore.openNotificationDialog({
      title: '게시물 삭제',
      content: '해당 게시물을 정말 삭제하시겠어요?',
      leftButton: {
        title: '취소',
        handleClick: handleCloseDialog,
      },
      rightButton: {
        title: '삭제',
        handleClick: onDeleteReview,
      },
    });
  };

  const handleMenuItemClick = (e: MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    const { textContent } = e.target as HTMLInputElement;
    if (textContent === '수정하기') {
      editReview();
    } else if (textContent === '삭제하기') {
      deleteReview();
    } else if (textContent === '신고하기') {
      reportReview();
    }
    handleMenuClose(e);
  };

  return (
    <CustomMenu
      open={open}
      onClose={handleMenuClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: -5, horizontal: 65 }}
    >
      {selectItems.map((item: string) => (
        <CustomMenuItem key={`menu-item-${item}`} value={item} onClick={handleMenuItemClick} dense>
          {item}
        </CustomMenuItem>
      ))}
    </CustomMenu>
  );
};

export default HeaderSelectMenu;

const CustomMenu = styled(Menu)({
  '& li': {
    borderBottom: `1px solid ${palette.grey[300]}`,
    height: 36,
  },
  '& li:last-of-type': {
    border: 'none',
  },
});

const CustomMenuItem = styled(MenuItem)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 24px',
  width: 97,
  height: 20,
  color: palette.grey[600],
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
});
