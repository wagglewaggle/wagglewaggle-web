import { useState, MouseEvent } from 'react';
import { Avatar, styled } from '@mui/material';
import { HeaderSelectMenu } from 'components/common/HeaderContents';
import { CustomIconButton } from 'components/common/HeaderContents/common';
import { getTimeDiff } from 'util/';
import { palette } from 'constants/';
import { ReactComponent as OptionsIcon } from 'assets/icons/drawer/options.svg';

type PropsType = {
  replyContent: string;
  profilePhoto: string;
  userNickname: string;
  createdDate: string;
  requestUrl: string;
  removeOptions: boolean;
};

const ReviewCardHeader = (props: PropsType) => {
  const { replyContent, profilePhoto, userNickname, createdDate, requestUrl, removeOptions } =
    props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOptionsClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e: MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Header>
      <CustomAvatar alt='profile-pic' src={profilePhoto} />
      <WriterInfoWrap>
        <span>{userNickname}</span>
        <span>{`${getTimeDiff(createdDate)}`}</span>
      </WriterInfoWrap>
      {!removeOptions && (
        <CustomIconButton onClick={handleOptionsClick}>
          <OptionsIcon />
        </CustomIconButton>
      )}
      <HeaderSelectMenu
        replyContent={replyContent}
        requestUrl={requestUrl}
        anchorEl={anchorEl}
        isMyReview={localStorage.getItem('@wagglewaggle_user_nickname') === userNickname}
        handleMenuClose={handleMenuClose}
      />
    </Header>
  );
};

export default ReviewCardHeader;

const Header = styled('div')({
  display: 'flex',
  height: 36,
  gap: 8,
  '& path': {
    fill: palette.grey[500],
  },
});

const CustomAvatar = styled(Avatar)({
  width: 36,
  height: 36,
});

const WriterInfoWrap = styled('div')({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  '& span:first-of-type': {
    color: palette.black,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '20px',
  },
  '& span:last-of-type': {
    color: palette.grey[400],
    fontSize: 12,
    fontWeight: 500,
  },
});
