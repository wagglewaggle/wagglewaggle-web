import { useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import MyReplyCard from './MyReplyCard';
import EmptyLists from '../common/EmptyLists';
import { useStore } from 'stores';
import { MyReplyType } from 'types/typeBundle';
import axiosRequest from 'api/axiosRequest';

const MyPostsReplies = () => {
  const { ProfileStore } = useStore().MobxStore;
  const { profilePageOpen, myPostsPageOpen, myReplies } = ProfileStore;

  const getMyReplies = useCallback(async () => {
    const response = await axiosRequest('get', 'user/reply');
    if (!response?.data.list) return;
    ProfileStore.setMyReplies(true, response.data.list);
  }, [ProfileStore]);

  useEffect(() => {
    if (!profilePageOpen || !myPostsPageOpen || myReplies.requested) return;
    getMyReplies();
  }, [getMyReplies, profilePageOpen, myPostsPageOpen, myReplies]);

  return (
    <>
      {myReplies.data.length === 0 ? (
        <EmptyLists
          title='관심 게시물이 없어요'
          content='저장해두고 싶은 게시물을 북마크 해보세요.'
        />
      ) : (
        <ReplyWrap>
          {myReplies.data.map((reply: MyReplyType) => (
            <MyReplyCard key={`my-reply-${reply.idx}`} reply={reply} />
          ))}
        </ReplyWrap>
      )}
    </>
  );
};

export default observer(MyPostsReplies);

const ReplyWrap = styled('div')({
  width: '100%',
});
