import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { Input, IconButton, styled } from '@mui/material';
import axiosRequest from 'api/axiosRequest';
import { palette } from 'constants/';
import { ReactComponent as SubmitIcon } from 'assets/icons/review/write-submit.svg';

const ReviewDetailInput = () => {
  const [reviewInput, setReviewInput] = useState<string>('');
  const [, , placeIdx, placeType, reviewPostIdx] = useLocation().pathname.split('/');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const response = await axiosRequest(
      'post',
      `${placeType}/${placeIdx}/review-post/${reviewPostIdx}/reply`,
      {
        content: reviewInput,
      }
    );
    if (!response?.data) return;
    setReviewInput('');
  };

  return (
    <Wrap>
      <CustomInput
        disableUnderline
        placeholder='댓글을 입력해주세요.'
        value={reviewInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <CustomIconButton onClick={handleSubmit}>
        <SubmitIcon />
      </CustomIconButton>
    </Wrap>
  );
};

export default ReviewDetailInput;

const Wrap = styled('div')({
  position: 'fixed',
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  borderTop: `1px solid ${palette.grey[300]}`,
  padding: '16px 24px',
  width: '100%',
  maxWidth: 386,
});

const CustomInput = styled(Input)({
  flex: 1,
  color: palette.black,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});

const CustomIconButton = styled(IconButton)({
  padding: 0,
  width: 24,
  height: 24,
});
