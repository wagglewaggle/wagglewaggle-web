import { useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { TextField, Drawer, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';

const ReviewWritePage = () => {
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [reviewInput, setReviewInput] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { ReviewStore, ScreenSizeStore, CustomDialogStore } = useStore().MobxStore;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pathnameArr = pathname.split('/');
  const { editMode } = ReviewStore.editReviewOptions;
  const placeIdx = pathnameArr[pathnameArr.length - 1];
  const searchPlaceName = searchParams.get('name') ?? '';
  const placeName = locationNames[searchPlaceName] ?? searchPlaceName;

  const handleReviewChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewInput(e.target.value);
  };

  const handleCloseDialog = () => {
    CustomDialogStore.setOpen(false);
    handleCloseDrawer();
  };

  const getReviews = async (requestUrl: string) => {
    const response = await axiosRequest('get', requestUrl);
    ReviewStore.setReviews(response?.data.list);
  };

  const getReviewDetail = async (requestUrl: string) => {
    if (!editMode) return;
    const response = await axiosRequest(
      'get',
      `${requestUrl}/${editMode ? ReviewStore.reviewDetail?.idx : ''}`
    );
    ReviewStore.setReviewDetail(response?.data);
  };

  const handleSubmit = async () => {
    const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(placeName) ? 'SKT' : 'KT';
    const requestUrl = `${requestType}/${placeIdx}/review-post`;
    const response = await axiosRequest(
      editMode ? 'put' : 'post',
      `${requestUrl}/${editMode ? ReviewStore.reviewDetail?.idx : ''}`,
      {
        content: reviewInput.trim(),
      }
    );
    if (!response?.data) return;
    getReviews(requestUrl);
    getReviewDetail(requestUrl);
    ReviewStore.setEditOptions({ editMode: false, content: '', requestUrl: '', type: 'review' });
    handleCloseDialog();
  };

  const handleSubmitClick = () => {
    CustomDialogStore.openNotificationDialog({
      title: '작성완료',
      content: '해당 게시물을 업로드 하시겠어요?',
      leftButton: {
        title: '취소',
        handleClick: handleCloseDialog,
      },
      rightButton: {
        title: '확인',
        handleClick: handleSubmit,
      },
    });
  };

  const handleCloseDrawer = () => {
    ReviewStore.setOpenReviewWritePage(false);
    setReviewInput('');
    navigate(-1);
  };

  useEffect(() => {
    setSubmittable(reviewInput?.length > 0);
  }, [reviewInput]);

  useEffect(() => {
    setReviewInput(ReviewStore.editReviewOptions.content);
  }, [ReviewStore.editReviewOptions]);

  return (
    <ReviewWriteDrawer
      open={ReviewStore.openReviewWritePage}
      anchor='right'
      onClose={handleCloseDrawer}
    >
      <HeaderWrap width={ScreenSizeStore.screenWidth - 48}>
        <CustomCloseIcon onClick={handleCloseDrawer} />
        <span>{placeName}</span>
        <SubmitButton submittable={submittable} onClick={handleSubmitClick}>
          완료
        </SubmitButton>
      </HeaderWrap>
      <CustomReviewField
        multiline
        autoFocus
        placeholder={`${placeName}에 관련하여 실시간 상황 공유 또는 질문해보세요. 와글와글 크루들이 답변해줄 거에요.`}
        value={reviewInput}
        onChange={handleReviewChange}
      />
    </ReviewWriteDrawer>
  );
};

export default observer(ReviewWritePage);

const ReviewWriteDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: 430,
  },
});

const HeaderWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['width', ''].includes(prop),
})<{ width: number }>(({ width }) => ({
  position: 'fixed',
  top: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '8px 24px',
  width,
  maxWidth: 382,
  height: 32,
  color: palette.black,
  '& span': {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '24px',
  },
}));

const CustomCloseIcon = styled(CloseIcon)({
  width: 24,
  height: 24,
  cursor: 'pointer',
  '& path': {
    fill: palette.black,
  },
});

const SubmitButton = styled('span', {
  shouldForwardProp: (prop: string) => prop !== 'submittable',
})<{ submittable: boolean }>(({ submittable }) => ({
  color: submittable ? palette.violet : palette.grey[300],
  cursor: 'pointer',
}));

const CustomReviewField = styled(TextField)({
  marginTop: 48,
  padding: '20px 24px',
  height: 'fit-content',
  '& div': {
    padding: 0,
  },
  '& fieldset': {
    display: 'none',
  },
  '& textarea': {
    minHeight: 'calc(100vh - 100px)',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
  },
});
