import { Avatar, styled } from '@mui/material';
import { getTimeDiff } from 'util/';
import { palette } from 'constants/';

type PropsType = {
  profilePhoto: string;
  userName: string;
  updatedDate: string;
};

const ReviewCardHeader = (props: PropsType) => {
  const { profilePhoto, userName, updatedDate } = props;

  return (
    <Header>
      <CustomAvatar alt='profile-pic' src={profilePhoto} />
      <WriterInfoWrap>
        <span>{userName}</span>
        <span>{`${getTimeDiff(updatedDate)}`}</span>
      </WriterInfoWrap>
    </Header>
  );
};

export default ReviewCardHeader;

const Header = styled('div')({
  display: 'flex',
  height: 36,
  gap: 8,
});

const CustomAvatar = styled(Avatar)({
  width: 36,
  height: 36,
});

const WriterInfoWrap = styled('div')({
  display: 'flex',
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
