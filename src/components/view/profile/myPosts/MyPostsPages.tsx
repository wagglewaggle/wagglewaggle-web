import { useRef, useEffect, useCallback, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, Tabs, Tab, styled } from '@mui/material';
import ProfileHeader from '../common/ProfileHeader';
import MyPostsPlaces from './MyPostsPlaces';
import MyPostsReplies from './MyPostsReplies';
import { useStore } from 'stores';
import { palette } from 'constants/';

const MyPostsPage = () => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { ProfileStore, ReviewStore } = useStore().MobxStore;
  const { myPostsPageOpen, pageListTab } = ProfileStore;
  const { reviewDetail, selectedReply } = ReviewStore;
  const tabs: ('place' | 'review')[] = ['place', 'review'];

  const handleMyPostsPageClose = useCallback(
    (isPopState?: boolean) => {
      ProfileStore.setMyPostsPageOpen(false);
      if (isPopState) return;
      navigate(-1);
    },
    [ProfileStore, navigate]
  );

  const handleTabChange = (_: SyntheticEvent, newTabIndex: number) => {
    ProfileStore.setPageListTab(tabs[newTabIndex]);
    const paperElement = drawerRef.current?.querySelector('.MuiPaper-root');
    paperElement?.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!myPostsPageOpen) return;
    if (!!reviewDetail || !!selectedReply) return;
    window.onpopstate = () => handleMyPostsPageClose(true);
  }, [handleMyPostsPageClose, myPostsPageOpen, reviewDetail, selectedReply]);

  useEffect(() => {
    if (myPostsPageOpen) return;
    return () => {
      ProfileStore.setMyPlaces(false, []);
      ProfileStore.setMyReplies(false, []);
    };
  }, [ProfileStore, myPostsPageOpen]);

  return (
    <MyPostsDrawer
      open={myPostsPageOpen}
      onClose={() => handleMyPostsPageClose()}
      anchor='right'
      ref={drawerRef}
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <ProfileHeader
        handleLeftClick={() => handleMyPostsPageClose(true)}
        title='내 글 목록'
        includesBorderBottom={false}
      />
      <BlankArea />
      <CustomTabs value={tabs.indexOf(pageListTab)} onChange={handleTabChange}>
        <CustomTab label='장소' />
        <CustomTab label='댓글' />
      </CustomTabs>
      {pageListTab === 'review' ? <MyPostsReplies /> : <MyPostsPlaces />}
    </MyPostsDrawer>
  );
};

export default observer(MyPostsPage);

const MyPostsDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 430,
  },
});

const CustomTabs = styled(Tabs)({
  position: 'fixed',
  top: 52,
  display: 'flex',
  width: '100%',
  maxWidth: 430,
  backgroundColor: palette.white,
  zIndex: 10,
  '& .MuiTab-root': {
    color: palette.grey[400],
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '20px',
  },
  '& .Mui-selected': {
    color: `${palette.black} !important`,
  },
  '& button': {
    borderBottom: `2px solid ${palette.grey[400]}`,
  },
  '& .MuiTabs-indicator': {
    backgroundColor: palette.black,
  },
});

const CustomTab = styled(Tab)({
  flex: 1,
});

const BlankArea = styled('div')({
  width: '100%',
  height: 94,
  minHeight: 94,
});
