import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { observer } from 'mobx-react';
import { TextField, IconButton, styled } from '@mui/material';
import axiosRequest from 'api/axiosRequest';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ReplyType } from 'types/typeBundle';
import { ReactComponent as SubmitIcon } from 'assets/icons/review/write-submit.svg';

const ReviewDetailInput = () => {
  const [reviewInput, setReviewInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { ReviewStore, ThemeStore } = useStore().MobxStore;
  const { reviewDetail, selectedReply, replyStatus, editReviewOptions } = ReviewStore;
  const { editMode, content, requestUrl, type } = editReviewOptions;
  const isDarkTheme = ThemeStore.theme === 'dark';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReviewInput(e.target.value);
  };

  const handleSubmit = async () => {
    const reviewIdx = reviewDetail?.idx;
    const placeInfo = reviewDetail?.place;
    if (!reviewIdx || !placeInfo) return;
    const replyIdx = selectedReply?.idx;
    const response = await axiosRequest(
      editMode ? 'put' : 'post',
      editMode
        ? requestUrl
        : `${placeInfo.type}/${placeInfo.idx}/review-post/${reviewIdx}/reply/${replyIdx ?? ''}`,
      {
        content: reviewInput.trim(),
      }
    );
    if (!response?.data) return;
    setReviewInput('');
    ReviewStore.initReviews(placeInfo.type as 'SKT' | 'KT', placeInfo.idx);
    await ReviewStore.initReviewDetail(placeInfo.type as 'SKT' | 'KT', placeInfo.idx, reviewIdx);
    const newSelectedReply = ReviewStore.reviewDetail?.replies.find(
      (reply: ReplyType) => reply.idx === replyIdx
    );
    newSelectedReply && ReviewStore.setSelectedReply(newSelectedReply);
    ReviewStore.setReplyStatus({ writeMode: false });
    ReviewStore.setEditOptions({ editMode: false, content: '', requestUrl: '', type: 'review' });
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!editMode || type === 'review') return;
    setReviewInput(content ?? '');
    inputRef.current?.focus();
  }, [content, editMode, type]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <CustomInput
        multiline
        autoFocus={replyStatus.writeMode}
        placeholder='댓글을 입력해주세요.'
        value={reviewInput}
        onChange={handleChange}
        inputProps={{ ref: inputRef }}
      />
      <CustomIconButton submittable={reviewInput?.length > 0} onClick={handleSubmit}>
        <SubmitIcon />
      </CustomIconButton>
    </Wrap>
  );
};

export default observer(ReviewDetailInput);

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
