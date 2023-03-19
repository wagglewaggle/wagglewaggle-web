import { styled } from '@mui/material';
import ReviewCardHeader from './ReviewCardHeader';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ReplyType, RereplyType } from 'types/typeBundle';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  reply: ReplyType;
  isLast: boolean;
}

interface ContentType {
  isLast: boolean;
  isRereply?: boolean;
  idx?: number;
  userName: string;
  updatedDate: string;
  content: string;
}

const ReplyCardContent = (props: ContentType) => {
  const { isLast, isRereply, idx, userName, updatedDate, content } = props;
  const { ReviewStore } = useStore().MobxStore;

  const handleWriteRereplyClick = () => {
    if (isRereply) return;
    ReviewStore.setReplyStatus({ writeMode: true, replyIdx: idx });
  };

  return (
    <ReplyWrap isLast={isLast} isRereply={isRereply}>
      <ReviewCardHeader profilePhoto={defaultPhoto} userName={userName} updatedDate={updatedDate} />
      <ReplyContent>{content}</ReplyContent>
      <IconsInfoWrap>
        <IconsWrap isPinned={false}>좋아요 {1 > 0 && String(0).padStart(2, '0')}</IconsWrap>
        {!isRereply && <IconsWrap onClick={handleWriteRereplyClick}>답글쓰기</IconsWrap>}
      </IconsInfoWrap>
    </ReplyWrap>
  );
};

const ReplyCard = (props: PropsType) => {
  const { reply, isLast } = props;
  const { user, updatedDate, content, levelReplies, idx } = reply;

  return (
    <>
      <ReplyCardContent
        isLast={isLast && levelReplies.length === 0}
        idx={idx}
        userName={user.name}
        updatedDate={updatedDate}
        content={content}
      />
      {levelReplies.map((rereply: RereplyType, idx: number) => (
        <ReplyCardContent
          isLast={isLast && idx === levelReplies.length - 1}
          isRereply
          userName={rereply.user.name}
          updatedDate={rereply.updatedDate}
          content={rereply.content}
        />
      ))}
    </>
  );
};

export default ReplyCard;

const ReplyWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isLast', 'isRereply'].includes(prop),
})<{ isLast: boolean; isRereply?: boolean }>(({ isLast, isRereply }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  marginBottom: isLast ? 56 : 0,
  width: 'calc(100% - 48px)',
  backgroundColor: isRereply ? palette.grey[200] : palette.white,
  gap: 8,
}));

const ReplyContent = styled('div')({
  display: '-webkit-box',
  width: '100%',
  height: 'auto',
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
});

const IconsInfoWrap = styled('div')({
  display: 'flex',
  gap: 12,
});

const IconsWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isPinned',
})<{ isPinned?: boolean }>(({ isPinned }) => ({
  display: 'flex',
  color: isPinned ? palette.violet : palette.grey[400],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  cursor: 'pointer',
}));
