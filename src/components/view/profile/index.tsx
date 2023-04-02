import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, Divider, styled } from '@mui/material';
import EditProfile from './EditProfile';
import ProfileHeader from './common/ProfileHeader';
import FavoritesPages from './favorites/FavoritesPages';
import MyPostsPage from './myPosts/MyPostsPages';
import TermsPage from './TermsPage';
import { useStore } from 'stores';
import { palette } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import { ReactComponent as RightIcon } from 'assets/icons/right-icon.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/profile/heart.svg';
import { ReactComponent as EditIcon } from 'assets/icons/profile/edit.svg';
import { ReactComponent as QuestionIcon } from 'assets/icons/profile/question.svg';
import { ReactComponent as LockIcon } from 'assets/icons/profile/lock.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

const Profile = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { AuthStore, ProfileStore, CustomDialogStore } = useStore().MobxStore;
  const { profilePageOpen, termsPageOpen, editPageOpen, favoritesPageOpen } = ProfileStore;

  const handleProfilePageClose = useCallback(
    (isPopState?: boolean) => {
      ProfileStore.setProfilePageOpen(false);
      if (isPopState) return;
      navigate(-1);
    },
    [ProfileStore, navigate]
  );

  const handleCloseDialog = () => {
    CustomDialogStore.setOpen(false);
  };

  const handleEditProfileClick = () => {
    navigate(`${pathname}${search}`);
    ProfileStore.setEditPageOpen(true);
  };

  const handleFavoritesClick = () => {
    navigate(`${pathname}${search}`);
    ProfileStore.setFavoritesPageOpen(true);
    ProfileStore.setPageListTab('place');
  };

  const handleMyPostsClick = () => {
    navigate(`${pathname}${search}`);
    ProfileStore.setMyPostsPageOpen(true);
    ProfileStore.setPageListTab('place');
  };

  const handleInquiryClick = () => {
    CustomDialogStore.openNotificationDialog({
      title: '1:1 문의',
      content: 'wagglewaggle2@gmail.com으로\r\n문의 사항을 보내주세요.',
      rightButton: {
        title: '확인',
        handleClick: handleCloseDialog,
      },
    });
  };

  const handleTermsClick = () => {
    navigate(`${pathname}${search}`);
    ProfileStore.setTermsPageOpen(true);
  };

  const handleAuthChange = () => {
    handleCloseDialog();
    navigate('/login');
  };

  const onLogout = () => {
    AuthStore.logout();
    handleProfilePageClose(true);
    handleCloseDialog();
    CustomDialogStore.openNotificationDialog({
      title: '로그아웃',
      content: '로그아웃이 완료되었습니다.',
      rightButton: {
        title: '확인',
        handleClick: handleAuthChange,
      },
    });
  };

  const handleLogoutClick = () => {
    CustomDialogStore.openNotificationDialog({
      title: '로그아웃',
      content: '해당 기기에서 로그아웃됩니다.',
      leftButton: {
        title: '취소',
        handleClick: handleCloseDialog,
      },
      rightButton: {
        title: '로그아웃',
        handleClick: onLogout,
      },
    });
  };

  const onDeactivate = async () => {
    const response = await axiosRequest('put', 'user/deactivate');
    if (!response?.data) return;
    handleProfilePageClose(true);
    handleCloseDialog();
    CustomDialogStore.openNotificationDialog({
      title: '회원 탈퇴',
      content: '회원 탈퇴가 완료되었습니다.',
      rightButton: {
        title: '확인',
        handleClick: handleAuthChange,
      },
    });
  };

  const handleDeactivateClick = () => {
    CustomDialogStore.openNotificationDialog({
      title: '회원 탈퇴',
      content: '탈퇴 시 서비스 사용이 어려우며,\r\n탈퇴 후 재가입은 7일 뒤 가능합니다.',
      leftButton: {
        title: '취소',
        handleClick: handleCloseDialog,
      },
      rightButton: {
        title: '회원탈퇴',
        handleClick: onDeactivate,
      },
    });
  };

  useEffect(() => {
    if (!profilePageOpen) return;
    if (termsPageOpen || editPageOpen || favoritesPageOpen) return;
    window.onpopstate = () => handleProfilePageClose(true);
  }, [handleProfilePageClose, profilePageOpen, termsPageOpen, editPageOpen, favoritesPageOpen]);

  useEffect(() => {
    const userNickname = localStorage.getItem('@wagglewaggle_user_nickname');
    if (!profilePageOpen || !userNickname) return;
    ProfileStore.setUserNickname(userNickname);
  }, [ProfileStore, profilePageOpen]);

  return (
    <>
      <ProfileDrawer
        open={profilePageOpen}
        onClose={() => handleProfilePageClose()}
        anchor='right'
        transitionDuration={{ enter: 250, exit: 0 }}
      >
        <ProfileHeader
          handleLeftClick={() => handleProfilePageClose()}
          title=''
          includesBorderBottom={false}
        />
        <BlankArea />
        <UserInfoWrap>
          <UserWrap>
            <UserPicture src={defaultPhoto} alt='user-pic' />
            <UserNickname>{ProfileStore.userNickname}</UserNickname>
          </UserWrap>
          <EditButton onClick={handleEditProfileClick}>프로필 수정</EditButton>
        </UserInfoWrap>
        <FeaturesWrap onClick={handleFavoritesClick}>
          <FeatureTitleWrap>
            <HeartIcon />
            관심장소
          </FeatureTitleWrap>
          <RightIcon />
        </FeaturesWrap>
        <FeaturesWrap onClick={handleMyPostsClick}>
          <FeatureTitleWrap>
            <EditIcon />
            내가 작성한 글
          </FeatureTitleWrap>
          <RightIcon />
        </FeaturesWrap>
        <FeaturesWrap onClick={handleInquiryClick}>
          <FeatureTitleWrap>
            <QuestionIcon />
            1:1 문의
          </FeatureTitleWrap>
          <RightIcon />
        </FeaturesWrap>
        <FeaturesWrap onClick={handleTermsClick}>
          <FeatureTitleWrap>
            <LockIcon />
            서비스 이용약관
          </FeatureTitleWrap>
          <RightIcon />
        </FeaturesWrap>
        <CustomDivider />
        <FeaturesWrap shady onClick={handleLogoutClick}>
          <FeatureTitleWrap shady>로그아웃</FeatureTitleWrap>
          <RightIcon />
        </FeaturesWrap>
        <FeaturesWrap shady onClick={handleDeactivateClick}>
          <FeatureTitleWrap shady>회원 탈퇴</FeatureTitleWrap>
          <RightIcon />
        </FeaturesWrap>
      </ProfileDrawer>
      <EditProfile />
      <FavoritesPages />
      <MyPostsPage />
      <TermsPage />
    </>
  );
};

export default observer(Profile);

const ProfileDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    width: '100%',
    maxWidth: 430,
  },
});

const UserInfoWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '32px 24px',
  width: 'calc(100% - 48px)',
});

const UserWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const UserPicture = styled('img')({
  width: 36,
  height: 36,
});

const UserNickname = styled('span')({
  fontSize: 24,
  fontWeight: 600,
  lineHeight: '24px',
});

const EditButton = styled('button')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${palette.violet}`,
  borderRadius: 4,
  padding: '8px 10px',
  width: 84,
  minWidth: 'fit-content',
  height: 36,
  color: palette.violet,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  backgroundColor: palette.white,
  cursor: 'pointer',
});

const FeaturesWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'shady',
})<{ shady?: boolean }>(({ shady }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  width: 'calc(100% - 48px)',
  cursor: 'pointer',
  '& svg': {
    width: 20,
    height: 20,
  },
  '& path': {
    fill: shady ? palette.grey[500] : palette.grey[600],
  },
}));

const FeatureTitleWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'shady',
})<{ shady?: boolean }>(({ shady }) => ({
  display: 'flex',
  color: shady ? palette.grey[500] : palette.grey[600],
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  gap: 6,
}));

const CustomDivider = styled(Divider)({
  border: `3px solid ${palette.grey[200]}`,
  margin: '6px 0',
});

const BlankArea = styled('div')({
  width: '100%',
  height: 48,
  minHeight: 48,
});
