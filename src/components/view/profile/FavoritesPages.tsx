import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, Tabs, Tab, styled } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import FavoritePlaces from './FavoritePlaces';
import FavoritePosts from './FavoritePosts';
import axiosRequest from 'api/axiosRequest';
import { useStore } from 'stores';
import { FavoritePlaceType, PinnedReviewType } from 'types/typeBundle';
import { palette } from 'constants/';

const FavoritesPage = () => {
  const [favPlaces, setFavPlaces] = useState<FavoritePlaceType[]>([]);
  const [favPosts, setFavPosts] = useState<PinnedReviewType[]>([]);
  const navigate = useNavigate();
  const { ProfileStore, ReviewStore } = useStore().MobxStore;
  const { profilePageOpen, favoritesPageOpen, favoritesTab } = ProfileStore;
  const tabs: ('place' | 'post')[] = ['place', 'post'];

  const handleFavoritesPageClose = useCallback(
    (isPopState?: boolean) => {
      ProfileStore.setFavoritesPageOpen(false);
      if (isPopState) return;
      navigate(-1);
    },
    [ProfileStore, navigate]
  );

  const handleTabChange = (_: SyntheticEvent, newTabIndex: number) => {
    ProfileStore.setFavoritesTab(tabs[newTabIndex]);
  };

  const getFavoritePosts = useCallback(async () => {
    const response = await axiosRequest('get', 'pin-review-post');
    if (!response?.data) return;
    setFavPosts(response.data.list);
  }, []);

  const getFavoritePlaces = useCallback(async () => {
    const response = await axiosRequest('get', 'pin-place');
    if (!response?.data) return;
    setFavPlaces(response.data.places);
  }, []);

  useEffect(() => {
    if (!ProfileStore.favoritesPageOpen) return;
    window.onpopstate = () => handleFavoritesPageClose(true);
  }, [handleFavoritesPageClose, ProfileStore.favoritesPageOpen]);

  useEffect(() => {
    if (!profilePageOpen) return;
    getFavoritePosts();
    getFavoritePlaces();
  }, [getFavoritePosts, getFavoritePlaces, profilePageOpen, ReviewStore.reviews]);

  return (
    <FavoritesDrawer
      open={favoritesPageOpen}
      onClose={() => handleFavoritesPageClose()}
      anchor='right'
    >
      <ProfileHeader handleLeftClick={handleFavoritesPageClose} title='관심 목록' />
      <CustomTabs value={tabs.indexOf(favoritesTab)} onChange={handleTabChange}>
        <CustomTab label={`장소 ${favPlaces.length}`} />
        <CustomTab label={`게시물 ${favPosts.length}`} />
      </CustomTabs>
      {favoritesTab === 'post' ? (
        <FavoritePosts favPosts={favPosts} />
      ) : (
        <FavoritePlaces favPlaces={favPlaces} />
      )}
    </FavoritesDrawer>
  );
};

export default observer(FavoritesPage);

const FavoritesDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 430,
  },
});

const CustomTabs = styled(Tabs)({
  display: 'flex',
  width: '100%',
  '& .MuiTab-root': {
    color: palette.grey[400],
    fontSize: 14,
    fontWeight: 600,
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
