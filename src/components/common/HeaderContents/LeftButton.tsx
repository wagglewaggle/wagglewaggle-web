import { useNavigate, useLocation } from 'react-router-dom';
import { CustomIconButton } from './common';
import { useStore } from 'stores';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

type PropsType = { backUrlInfo?: string; isExpanded?: boolean };

const LeftButton = (props: PropsType) => {
  const { backUrlInfo, isExpanded } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ReviewStore, CustomDrawerStore } = useStore().MobxStore;

  const handleRefresh = () => {
    if (!pathname.split('/').includes('review')) {
      isExpanded && CustomDrawerStore.setDrawerStatus({ expanded: 'appeared' });
      return;
    }
    navigate((backUrlInfo as string) ?? -1);
    ReviewStore.initReviewDetail();
  };

  return (
    <CustomIconButton onClick={handleRefresh}>
      <LeftIcon />
    </CustomIconButton>
  );
};

export default LeftButton;
