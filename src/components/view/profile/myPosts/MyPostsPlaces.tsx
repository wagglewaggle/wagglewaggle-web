import { useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import EmptyLists from '../common/EmptyLists';
import { ReviewCard } from 'components/common';
import { useStore } from 'stores';
import { ReviewType, CategoryType } from 'types/typeBundle';
import { getImageSymbol } from 'util/';
import { reviewStrConstants } from 'constants/';
import axiosRequest from 'api/axiosRequest';

const MyPostsPlaces = () => {
  const { ProfileStore, LocationStore } = useStore().MobxStore;
  const { profilePageOpen, myPostsPageOpen, myPlaces } = ProfileStore;
  const { deleted, reportDeleted } = reviewStrConstants;

  const getMyPlaces = useCallback(async () => {
    const response = await axiosRequest('get', 'user/review-post');
    if (!response?.data.list) return;
    ProfileStore.setMyPlaces(true, response.data.list);
  }, [ProfileStore]);

  useEffect(() => {
    if (!profilePageOpen || !myPostsPageOpen || myPlaces.requested) return;
    getMyPlaces();
  }, [getMyPlaces, profilePageOpen, myPostsPageOpen, myPlaces]);

  return (
    <Wrap>
      {myPlaces.data.length === 0 ? (
        <EmptyLists title='관심 장소가 없어요.' content='관심가는 장소를 북마크 해보세요.' />
      ) : (
        <ReviewCardsWrap>
          {myPlaces.data.map((post: ReviewType) => (
            <ReviewCard
              key={`my-post-${post.idx}`}
              review={{
                ...post,
                writer: {
                  ...post.writer,
                  nickname: localStorage.getItem('@wagglewaggle_user_nickname') ?? '(알수없음)',
                },
              }}
              shouldIncludeOnClick={![deleted, reportDeleted].includes(post.status)}
              fromProfile
              tagData={{
                symbol: getImageSymbol(
                  LocationStore.categories[post.place.name].map(
                    (category: CategoryType) => category.type
                  )
                ),
                placeName: post.place.name,
              }}
            />
          ))}
        </ReviewCardsWrap>
      )}
    </Wrap>
  );
};

export default observer(MyPostsPlaces);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

const ReviewCardsWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: 16,
  width: '100%',
});
