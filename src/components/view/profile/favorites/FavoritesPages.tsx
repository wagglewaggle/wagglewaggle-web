import { useRef, useEffect, useCallback, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, Tabs, Tab, styled } from '@mui/material';
import ProfileHeader from '../common/ProfileHeader';
import FavoritePlaces from './FavoritePlaces';
import FavoriteReviews from './FavoriteReviews';
import axiosRequest from 'api/axiosRequest';
import { useStore } from 'stores';
import { palette } from 'constants/';

const FavoritesPage = () => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { ProfileStore, ReviewStore } = useStore().MobxStore;
  const { profilePageOpen, favoritesPageOpen, favPlaces, favReviews, pageListTab } = ProfileStore;
  const { reviewDetail, selectedReply } = ReviewStore;
  const tabs: ('place' | 'review')[] = ['place', 'review'];

  const handleFavoritesPageClose = useCallback(
    (isPopState?: boolean) => {
      ProfileStore.setFavoritesPageOpen(false);
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

  const getFavoritePlaces = useCallback(async () => {
    const response = await axiosRequest('get', 'pin-place');
    if (!response?.data) return;
    ProfileStore.setFavPlaces(true, response.data.places);
  }, [ProfileStore]);

  const getFavoriteReviews = useCallback(async () => {
    const response = await axiosRequest('get', 'pin-review-post');
    if (!response?.data) return;
    ProfileStore.setFavReviews(true, response.data.list);
  }, [ProfileStore]);

  useEffect(() => {
    if (!favoritesPageOpen) return;
    if (!!reviewDetail || !!selectedReply) return;
    window.onpopstate = () => handleFavoritesPageClose(true);
  }, [handleFavoritesPageClose, favoritesPageOpen, reviewDetail, selectedReply]);

  useEffect(() => {
    if (!profilePageOpen || !favoritesPageOpen || favPlaces.requested) return;
    if (!favPlaces.requested) {
      getFavoritePlaces();
    }
    if (!favReviews.requested) {
      getFavoriteReviews();
    }
  }, [
    getFavoritePlaces,
    getFavoriteReviews,
    profilePageOpen,
    favoritesPageOpen,
    favPlaces.requested,
    favReviews.requested,
  ]);

  useEffect(() => {
    if (favoritesPageOpen) return;
    return () => {
      ProfileStore.setFavPlaces(false, []);
      ProfileStore.setFavReviews(false, []);
    };
  }, [ProfileStore, favoritesPageOpen]);

  return (
    <FavoritesDrawer
      open={favoritesPageOpen}
      onClose={() => handleFavoritesPageClose()}
      anchor='right'
      ref={drawerRef}
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <ProfileHeader
        handleLeftClick={() => handleFavoritesPageClose(true)}
        title='관심 목록'
        includesBorderBottom={false}
      />
      <CustomTabs value={tabs.indexOf(pageListTab)} onChange={handleTabChange}>
        <CustomTab label={`장소 ${favPlaces.data.length}`} />
        <CustomTab label={`게시물 ${favReviews.data.length}`} />
      </CustomTabs>
      <BlankArea />
      {pageListTab === 'review' ? <FavoriteReviews /> : <FavoritePlaces />}
    </FavoritesDrawer>
  );
};

export default observer(FavoritesPage);

const FavoritesDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
});

const CustomTabs = styled(Tabs)({
  position: 'fixed',
  top: 52,
  display: 'flex',
  width: '100%',
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
  padding: '12px 16px 8px',
  maxWidth: 'none',
});

const BlankArea = styled('div')({
  width: '100%',
  height: 94,
  minHeight: 94,
});
