import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Wrap } from 'components/view/review';
import { useStore } from 'stores';

const ReviewWritePage = () => {
  const { ThemeStore, ReviewStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';

  useEffect(() => {
    ReviewStore.setWriteReviewButtonVisible(false);
  }, [ReviewStore]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <div>review write page</div>
    </Wrap>
  );
};

export default observer(ReviewWritePage);
