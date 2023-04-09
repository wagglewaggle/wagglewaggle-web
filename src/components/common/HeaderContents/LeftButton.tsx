import { useLocation, useNavigate } from 'react-router-dom';
import { CustomIconButton } from './common';
import { useStore } from 'stores';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

type PropsType = { isExpanded?: boolean };

const LeftButton = (props: PropsType) => {
  const { isExpanded } = props;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { ReviewStore, CustomDrawerStore } = useStore().MobxStore;

  const handleReviewClose = () => {
    ReviewStore.setReplyStatus({ writeMode: false });
    if (ReviewStore.selectedReply) {
      ReviewStore.setSelectedReply(null);
      return;
    }
    if (ReviewStore.reviewDetail) {
      ReviewStore.setReviewDetail(null);
      return;
    }
    navigate(-1);
  };

  const handleRefresh = () => {
    if (pathname.split('/').includes('review')) {
      handleReviewClose();
      return;
    }

    isExpanded && CustomDrawerStore.setDrawerStatus({ expanded: 'appeared' });
  };

  return (
    <CustomIconButton onClick={handleRefresh}>
      <LeftIcon />
    </CustomIconButton>
  );
};

export default LeftButton;
