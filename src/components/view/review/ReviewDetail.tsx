import { observer } from 'mobx-react';
import { useStore } from 'stores';
import { ReviewCard } from 'components/common';
import { ReviewDetailType } from 'types/typeBundle';

const ReviewDetail = () => {
  const { ReviewStore } = useStore().MobxStore;
  const { reviewDetail } = ReviewStore;

  return <ReviewCard review={reviewDetail as ReviewDetailType} isDetail />;
};

export default observer(ReviewDetail);
