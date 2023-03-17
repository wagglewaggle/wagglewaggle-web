import { styled } from '@mui/material';
import ReviewCardHeader from './ReviewCardHeader';
import { palette } from 'constants/';
import { ReplyType } from 'types/typeBundle';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  reply: ReplyType;
}

const ReplyCard = (props: PropsType) => {
  const { reply } = props;

  return (
    <ReplyWrap>
      <ReviewCardHeader
        profilePhoto={defaultPhoto}
        userName={reply.user.name}
        updatedDate={reply.updatedDate}
      />
      <ReplyContent>{reply.content}</ReplyContent>
      <IconsInfoWrap>
        <IconsWrap isPinned={false}>좋아요 {String(0).padStart(2, '0')}</IconsWrap>
        <IconsWrap>답글쓰기</IconsWrap>
      </IconsInfoWrap>
    </ReplyWrap>
  );
};

export default ReplyCard;

const ReplyWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  width: 'calc(100% - 48px)',
  gap: 8,
});

const ReplyContent = styled('div')({
  display: '-webkit-box',
  width: '100%',
  height: 'auto',
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});

const IconsInfoWrap = styled('div')({
  display: 'flex',
  gap: 12,
});

const IconsWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isPinned',
})<{ isPinned?: boolean }>(({ isPinned }) => ({
  display: 'flex',
  color: palette.grey[400],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));
