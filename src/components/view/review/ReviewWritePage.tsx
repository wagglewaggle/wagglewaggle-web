import { useState, useEffect, ChangeEvent } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { TextField, styled } from '@mui/material';
import { Wrap } from 'components/view/review';
import { useStore } from 'stores';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg';

const ReviewWritePage = () => {
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [reviewInput, setReviewInput] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { ThemeStore, ReviewStore, ScreenSizeStore, CustomDialogStore } = useStore().MobxStore;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isDarkTheme = ThemeStore.theme === 'dark';
  const pathnameArr = pathname.split('/');
  const placeIdx = pathnameArr[pathnameArr.length - 1];
  const searchPlaceName = searchParams.get('name') ?? '';
  const placeName = locationNames[searchPlaceName] ?? searchPlaceName;
  const textareaMinHeight = ScreenSizeStore.screenHeight - 95;

  const handleCancelClick = () => {
    navigate(-1);
  };

  const handleReviewChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewInput(e.target.value);
  };

  const handleCloseDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  const handleSubmit = async () => {
    const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(placeName) ? 'SKT' : 'KT';
    const requestUrl = `${requestType}/${placeIdx}/review-post`;
    const postResponse = await axiosRequest('post', requestUrl, {
      content: reviewInput,
    });
    if (!postResponse?.data) return;
    const getResponse = await axiosRequest('get', requestUrl);
    ReviewStore.setReviews(getResponse?.data.list);
    setReviewInput('');
    navigate(`/review/${placeIdx}?name=${placeName}`);
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

  useEffect(() => {
    ReviewStore.setWriteReviewButtonVisible(false);
  }, [ReviewStore]);

  useEffect(() => {
    setSubmittable(reviewInput.length > 0);
  }, [reviewInput]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <HeaderWrap width={ScreenSizeStore.screenWidth - 48}>
        <CustomCloseIcon onClick={handleCancelClick} />
        <span>{placeName}</span>
        <SubmitButton submittable={submittable} onClick={handleSubmitClick}>
          완료
        </SubmitButton>
      </HeaderWrap>
      <CustomReviewField
        minHeight={textareaMinHeight}
        multiline
        autoFocus
        placeholder={`${placeName}에 관련하여 실시간 상황 공유 또는 질문해보세요. 와글와글 크루들이 답변해줄 거에요.`}
        value={reviewInput}
        onChange={handleReviewChange}
      />
    </Wrap>
  );
};

export default observer(ReviewWritePage);

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

const CustomReviewField = styled(TextField, {
  shouldForwardProp: (prop: string) => prop !== 'minHeight',
})<{ minHeight: number }>(({ minHeight }) => ({
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
    minHeight,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
  },
}));
