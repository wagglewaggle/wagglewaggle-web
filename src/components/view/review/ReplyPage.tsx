import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import { useStore } from 'stores';
import { ReplyCard } from 'components/common';
import { CustomIconButton } from 'components/common/HeaderContents/common';
import ReviewDetailInput from './ReviewDetailInput';
import { ReviewDetailType } from 'types/typeBundle';
import { palette } from 'constants/';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

const ReplyPage = () => {
  const navigate = useNavigate();
  const { ReviewStore } = useStore().MobxStore;

  const handleCloseDrawer = useCallback(
    (isPopState?: boolean) => {
      ReviewStore.setSelectedReply(null);
      ReviewStore.setReplyStatus({ writeMode: false });
      ReviewStore.setEditOptions({ editMode: false, content: '', requestUrl: '', type: 'review' });
      if (isPopState) return;
      navigate(-1);
    },
    [ReviewStore, navigate]
  );

  useEffect(() => {
    if (!ReviewStore.selectedReply) return;
    window.onpopstate = () => handleCloseDrawer(true);
  }, [handleCloseDrawer, ReviewStore.selectedReply]);

  return (
    <ReplyDrawer
      open={!!ReviewStore.selectedReply}
      anchor='right'
      onClose={() => handleCloseDrawer()}
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <Wrap>
        <SubHeader>
          <CustomIconButton onClick={() => handleCloseDrawer()}>
            <LeftIcon />
          </CustomIconButton>
        </SubHeader>
        <BlankArea />
        {ReviewStore.selectedReply && (
          <ReplyCard
            review={ReviewStore.reviewDetail as ReviewDetailType}
            reply={ReviewStore.selectedReply}
            isLast
            isReplyPage
          />
        )}
        <ReviewDetailInput />
      </Wrap>
    </ReplyDrawer>
  );
};

export default observer(ReplyPage);

const ReplyDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
  },
});

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: palette.white,
  zIndex: 100,
});

const BlankArea = styled('div')({
  width: '100%',
  height: 48,
});

const SubHeader = styled('div')({
  position: 'fixed',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '0 24px',
  width: 'calc(100% - 48px)',
  height: 48,
  minHeight: 48,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  backgroundColor: palette.white,
  gap: 8,
  zIndex: 10,
});
