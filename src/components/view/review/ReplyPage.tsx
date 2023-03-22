import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { CustomHeader, ReplyCard } from 'components/common';
import ReviewDetailInput from './ReviewDetailInput';
import { ReplyType, ReviewDetailType } from 'types/typeBundle';
import { palette } from 'constants/';
import axiosRequest from 'api/axiosRequest';

const ReplyPage = () => {
  const { pathname } = useLocation();
  const pathnameArr = pathname.split('/');
  const [, , , placeIdx, requestType, postIdx, replyIdx] = pathnameArr;
  const { ReviewStore } = useStore().MobxStore;

  const getSelectedReply = useCallback(async () => {
    const response = await axiosRequest('get', `${requestType}/${placeIdx}/review-post/${postIdx}`);
    if (!response?.data) return;
    ReviewStore.setReviewDetail(response.data as ReviewDetailType);
  }, [ReviewStore, placeIdx, requestType, postIdx]);

  useEffect(() => {
    ReviewStore.setWriteReviewButtonVisible(false);
    if (ReviewStore.selectedReply) return;
    getSelectedReply();
  }, [ReviewStore, ReviewStore.selectedReply, getSelectedReply]);

  useEffect(() => {
    const selectedReply = ReviewStore.reviewDetail?.replies.find(
      (reply: ReplyType) => reply.idx === Number(replyIdx)
    );
    if (!selectedReply) return;
    ReviewStore.setSelectedReply(selectedReply);
  }, [ReviewStore, ReviewStore.reviewDetail, replyIdx]);

  return (
    <Wrap>
      <CustomHeader isReplyPage />
      <BlankArea />
      {ReviewStore.selectedReply && (
        <ReplyCard reply={ReviewStore.selectedReply} isLast isReplyPage />
      )}
      {ReviewStore.replyStatus.writeMode && <ReviewDetailInput />}
    </Wrap>
  );
};

export default observer(ReplyPage);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '100vh',
  backgroundColor: palette.white,
  zIndex: 100,
});

const BlankArea = styled('div')({
  width: '100%',
  height: 48,
});
