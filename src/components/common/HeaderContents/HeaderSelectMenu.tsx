import { MouseEvent } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Menu, MenuItem, styled } from '@mui/material';
import { useStore } from 'stores';
import axiosRequest from 'api/axiosRequest';
import { RequestType } from 'types/typeBundle';
import { palette } from 'constants/';

type PropsType = {
  replyContent: string;
  requestUrl?: string;
  anchorEl: null | HTMLElement;
  isMyReview: boolean;
  handleMenuClose: (e: MouseEvent) => void;
};

const HeaderSelectMenu = (props: PropsType) => {
  const { replyContent, requestUrl, anchorEl, isMyReview, handleMenuClose } = props;
  const { ReviewStore, CustomDialogStore } = useStore().MobxStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const { reviewDetail } = ReviewStore;
  const open = Boolean(anchorEl);
  const selectItems = isMyReview ? ['수정하기', '삭제하기'] : ['신고하기'];
  const reviewRequestUrl = `${reviewDetail?.place.type}/${reviewDetail?.place.idx}/review-post/${reviewDetail?.idx}`;

  const onReportReview = async () => {
    if (!requestUrl && !reviewRequestUrl) return;
    const requestUrlArr = (requestUrl ?? reviewRequestUrl).split('/');
    const targetIdx = requestUrlArr[requestUrlArr.length - 1];
    const reportRequestUrl = `report/${requestUrl ? 'reply' : 'review-post'}/${targetIdx}`;
    const response = await axiosRequest('post', reportRequestUrl);
    handleCloseDialog();
    // @ts-expect-error The following message only comes from server when duplicate report request has been sent
    const errMessage: string | undefined = response?.response?.data?.message;
    const notiDialogContent = `${requestUrl ? '댓글' : '게시물'} 신고`;
    CustomDialogStore.openNotificationDialog({
      title: `${requestUrl ? '댓글' : '게시물'} 신고`,
      content: errMessage ?? `${notiDialogContent}가 완료되었습니다.`,
      rightButton: {
        title: '확인',
        handleClick: handleCloseDialog,
      },
    });
  };

  const reportReview = () => {
    CustomDialogStore.openNotificationDialog({
      title: `${requestUrl ? '댓글' : '게시물'} 신고`,
      content: '하위 사유에 해당되는 경우에 신고해주세요.',
      subContent:
        '욕설 및 비방 / 혐오 표현 / 음란물 / 홍보 / 도배 / 불법 정보 유포 / 개인정보 노출',
      leftButton: {
        title: '취소',
        handleClick: handleCloseDialog,
      },
      rightButton: {
        title: '신고',
        handleClick: onReportReview,
      },
    });
  };

  const editReview = () => {
    ReviewStore.setEditOptions({
      editMode: true,
      content: requestUrl ? replyContent : reviewDetail?.content ?? '',
      requestUrl: requestUrl ?? '',
      type: requestUrl ? 'reply' : 'review',
    });
    if (!requestUrl) {
      ReviewStore.setOpenReviewWritePage(true);
      navigate(`${pathname}${search}`);
      return;
    }
  };

  const onDeleteReview = async () => {
    if (!requestUrl && !reviewRequestUrl) return;
    const response = await axiosRequest('delete', requestUrl ?? reviewRequestUrl);
    if (!response?.data || !reviewDetail) return;
    handleCloseDialog();
    ReviewStore.initReviews(reviewDetail.place.type as RequestType, reviewDetail.place.idx);
    if (requestUrl) {
      ReviewStore.setSelectedReply(null);
      await ReviewStore.initReviewDetail(
        reviewDetail.place.type as RequestType,
        reviewDetail.place.idx,
        reviewDetail.idx
      );
      if (searchParams.get('replyIdx')) {
        searchParams.delete('replyIdx');
        setSearchParams(searchParams);
      }
      return;
    }
    ReviewStore.setReviewDetail(null);
    if (searchParams.get('reviewIdx')) {
      searchParams.delete('reviewIdx');
      setSearchParams(searchParams);
    }
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
