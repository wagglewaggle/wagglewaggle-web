import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import ProfileHeader from './ProfileHeader';
import Register from '../register';
import { useStore } from 'stores';

const EditProfile = () => {
  const { ProfileStore } = useStore().MobxStore;

  const handleEditPageClose = () => {
    ProfileStore.setEditPageOpen(false);
  };

  return (
    <EditProfileDrawer
      open={ProfileStore.editPageOpen}
      onClose={handleEditPageClose}
      anchor='right'
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
