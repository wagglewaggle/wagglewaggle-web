import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import EmptyLists from './EmptyLists';
import { ReviewCard } from 'components/common';
import { getImageSymbol } from 'util/';
import { useStore } from 'stores';
import { CategoryType, PinnedReviewType } from 'types/typeBundle';

type PropsType = {
  favPosts: PinnedReviewType[];
};

const FavoritePosts = (props: PropsType) => {
  const { favPosts } = props;
  const { LocationStore } = useStore().MobxStore;

  return (
    <Wrap>
      {favPosts.length === 0 ? (
        <EmptyLists
          title='즐겨찾기한 게시물이 없어요.'
          content='지금 바로 관심있는 게시물을 즐겨찾기 해보세요!'
        />
      ) : (
        <ReviewCardsWrap>
          {favPosts.map((post: PinnedReviewType) => (
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

export default observer(FavoritePosts);

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
