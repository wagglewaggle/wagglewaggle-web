import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import { useStore } from 'stores';
import { ReplyCard, LeftButton } from 'components/common';
import ReviewDetailInput from './ReviewDetailInput';
import { palette } from 'constants/';

const ReplyPage = () => {
  const { ReviewStore } = useStore().MobxStore;

  const handleCloseDrawer = () => {
    ReviewStore.setSelectedReply(null);
    ReviewStore.setReplyStatus({ writeMode: false });
  };

  return (
    <ReplyDrawer open={!!ReviewStore.selectedReply} anchor='right' onClose={handleCloseDrawer}>
      <Wrap>
        <SubHeader>
          <LeftButton />
        </SubHeader>
        {ReviewStore.selectedReply && (
          <ReplyCard reply={ReviewStore.selectedReply} isLast isReplyPage />
        )}
        {ReviewStore.replyStatus.writeMode && <ReviewDetailInput />}
      </Wrap>
    </ReplyDrawer>
  );
};

export default observer(ReplyPage);

const ReplyDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: 430,
  },
});

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: palette.white,
  zIndex: 100,
});

const SubHeader = styled('div')({
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
  gap: 8,
});
