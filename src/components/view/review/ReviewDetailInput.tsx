import { useState, useRef, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, IconButton, styled } from '@mui/material';
import axiosRequest from 'api/axiosRequest';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ReviewDetailType } from 'types/typeBundle';
import { ReactComponent as SubmitIcon } from 'assets/icons/review/write-submit.svg';

const ReviewDetailInput = () => {
  const [reviewInput, setReviewInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [, , placeIdx, placeType, reviewPostIdx] = useLocation().pathname.split('/');
  const { ReviewStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewInput(e.target.value);
  };

  const handleSubmit = async () => {
    const postResponse = await axiosRequest(
      'post',
      `${placeType}/${placeIdx}/review-post/${reviewPostIdx}/reply/${
        ReviewStore.replyStatus.replyIdx ?? ''
      }`,
      {
        content: reviewInput,
      }
    );
    if (!postResponse?.data) return;
    setReviewInput('');
    const getResponse = await axiosRequest(
      'get',
      `${placeType}/${placeIdx}/review-post/${reviewPostIdx}`
    );
    if (!getResponse?.data) return;
    ReviewStore.setReviewDetail(getResponse.data as ReviewDetailType);
    ReviewStore.setReplyStatus({ writeMode: false });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    inputRef.current?.blur();
  };

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CustomInput
        ref={inputRef}
        multiline
        placeholder='댓글을 입력해주세요.'
        value={reviewInput}
        onChange={handleChange}
      />
      <CustomIconButton submittable={reviewInput.length > 0} onClick={handleSubmit}>
        <SubmitIcon />
      </CustomIconButton>
    </Wrap>
  );
};

export default ReviewDetailInput;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  position: 'fixed',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  borderTop: `1px solid ${palette.grey[300]}`,
  padding: '16px 24px',
  width: 'calc(100% - 48px)',
  maxWidth: 382,
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  gap: 16,
}));

const CustomInput = styled(TextField)({
  flex: 1,
  height: 'fit-content',
  '& textarea': {
    color: palette.black,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
  },
  '& div': {
    padding: 0,
  },
  '& fieldset': {
    display: 'none',
  },
});

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'submittable',
})<{ submittable: boolean }>(({ submittable }) => ({
  padding: 0,
  width: 24,
  height: 24,
  '& path': {
    fill: submittable ? palette.white : palette.grey[500],
  },
  '& rect': {
    fill: submittable ? palette.violet : palette.grey[300],
  },
}));
