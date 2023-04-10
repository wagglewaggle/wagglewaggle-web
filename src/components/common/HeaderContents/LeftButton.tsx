import { CustomIconButton } from './common';
import { useStore } from 'stores';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

type PropsType = { isExpanded?: boolean };

const LeftButton = (props: PropsType) => {
  const { isExpanded } = props;
  const { CustomDrawerStore } = useStore().MobxStore;

  const handleRefresh = () => {
    isExpanded && CustomDrawerStore.setDrawerStatus({ expanded: 'appeared' });
  };

  return (
    <CustomIconButton onClick={handleRefresh}>
      <LeftIcon />
    </CustomIconButton>
  );
};

export default LeftButton;
