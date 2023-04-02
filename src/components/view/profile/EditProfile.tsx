import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import ProfileHeader from './common/ProfileHeader';
import Register from '../register';
import { useStore } from 'stores';

const EditProfile = () => {
  const navigate = useNavigate();
  const { ProfileStore } = useStore().MobxStore;

  const handleEditPageClose = useCallback(
    (isPopState?: boolean) => {
      ProfileStore.setEditPageOpen(false);
      if (isPopState) return;
      navigate(-1);
    },
    [ProfileStore, navigate]
  );

  useEffect(() => {
    if (!ProfileStore.editPageOpen) return;
    window.onpopstate = () => handleEditPageClose(true);
  }, [handleEditPageClose, ProfileStore.editPageOpen]);

  return (
    <EditProfileDrawer
      open={ProfileStore.editPageOpen}
      onClose={() => handleEditPageClose()}
      anchor='right'
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <ProfileHeader handleLeftClick={handleEditPageClose} title='프로필 수정' />
      <Register isEdit currentNickname={sessionStorage.getItem('@wagglewaggle_user_nickname')} />
    </EditProfileDrawer>
  );
};

export default observer(EditProfile);

const EditProfileDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 430,
  },
});
