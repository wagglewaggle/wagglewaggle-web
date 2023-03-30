import { useEffect, useCallback, useRef } from 'react';
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
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const navigate = useNavigate();
  const { ReviewStore } = useStore().MobxStore;
  const paperElement = drawerRef.current?.querySelector('.MuiPaper-root');

  const handleCloseDrawer = useCallback(
    (isPopState?: boolean) => {
      ReviewStore.setSelectedReply(null);
      ReviewStore.setReplyStatus({ writeMode: false });
      ReviewStore.setEditOptions({ editMode: false, content: '', requestUrl: '', type: 'review' });
      firstRender.current = true;
      if (isPopState) return;
      navigate(-1);
    },
    [ReviewStore, navigate]
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    paperElement?.scrollTo({ top: paperElement.scrollHeight, behavior: 'smooth' });
  }, [paperElement, ReviewStore.selectedReply?.levelReplies.length]);

  useEffect(() => {
    if (!ReviewStore.selectedReply) return;
    window.onpopstate = () => handleCloseDrawer(true);
  }, [handleCloseDrawer, ReviewStore.selectedReply]);

  return (
    <ReplyDrawer
      open={!!ReviewStore.selectedReply}
      anchor='right'
      onClose={() => handleCloseDrawer()}
      ref={drawerRef}
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <Wrap>
        <SubHeader>
          <CustomIconButton onClick={() => handleCloseDrawer(true)}>
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
  maxWidth: 382,
  height: 48,
  minHeight: 48,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  backgroundColor: palette.white,
  gap: 8,
  zIndex: 10,
});
