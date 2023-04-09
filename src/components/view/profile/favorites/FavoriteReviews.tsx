import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import EmptyLists from '../common/EmptyLists';
import { ReviewCard } from 'components/common';
import { getImageSymbol } from 'util/';
import { useStore } from 'stores';
import { CategoryType, PinnedReviewType } from 'types/typeBundle';

const FavoriteReviews = () => {
  const { ProfileStore, LocationStore } = useStore().MobxStore;
  const { favReviews } = ProfileStore;

  return (
    <Wrap>
      {favReviews.data.length === 0 ? (
        <EmptyLists
          title='작성한 댓글이 없어요'
          content='게시물에 댓글을 달아 소통과 정보 공유를 해보세요.'
        />
      ) : (
        <ReviewCardsWrap>
          {favReviews.data.map((post: PinnedReviewType) => (
            <ReviewCard
              key={`favorite-post-${post.idx}`}
              review={post.reviewPost}
              shouldIncludeOnClick
              fromProfile
              tagData={{
                symbol: getImageSymbol(
                  LocationStore.categories[post.reviewPost.place.name].map(
                    (category: CategoryType) => category.type
                  )
                ),
                placeName: post.reviewPost.place.name,
              }}
            />
          ))}
        </ReviewCardsWrap>
      )}
    </Wrap>
  );
};

export default observer(FavoriteReviews);

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
