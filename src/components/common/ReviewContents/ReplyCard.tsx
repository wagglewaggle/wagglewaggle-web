import { Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material';
import ReviewCardHeader from './ReviewCardHeader';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ReplyType, RereplyType } from 'types/typeBundle';
import { ReactComponent as DownIcon } from 'assets/icons/down-icon.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  reply: ReplyType;
  shortened?: boolean;
  isLast: boolean;
  isReplyPage?: boolean;
}

interface ContentType {
  reply: ReplyType;
  isLast: boolean;
  isRereply?: boolean;
  handleShowMoreClick?: () => void;
  idx?: number;
  userName: string;
  updatedDate: string;
  content: string;
  isReplyPage?: boolean;
}

const ReplyCardContent = (props: ContentType) => {
  const {
    reply,
    isLast,
    isRereply,
    handleShowMoreClick = () => {},
    idx,
    userName,
    updatedDate,
    content,
    isReplyPage,
  } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ReviewStore } = useStore().MobxStore;

  const handleWriteRereplyClick = () => {
    if (isRereply) return;
    ReviewStore.setSelectedReply(reply);
    ReviewStore.setReplyStatus({ writeMode: true, replyIdx: idx });
    const pathnameArr = pathname.split('/');
    if (isReplyPage) return;
    pathnameArr.splice(2, 0, 'reply');
    pathnameArr.push(String(reply.idx));
    navigate(pathnameArr.join('/'));
  };

  return (
    <ReplyWrap isLast={isLast} isRereply={isRereply} onClick={handleShowMoreClick}>
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
  const { reply, shortened, isLast, isReplyPage } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { ReviewStore } = useStore().MobxStore;
  const { user, updatedDate, content, levelReplies, idx } = reply;
  const rereplies = levelReplies.slice(0, shortened ? 3 : levelReplies.length);

  const handleShowMoreClick = () => {
    ReviewStore.setSelectedReply(reply);
    const pathnameArr = pathname.split('/');
    if (isReplyPage) return;
    pathnameArr.splice(2, 0, 'reply');
    pathnameArr.push(String(reply.idx));
    navigate(pathnameArr.join('/'));
  };

  return (
    <>
      <ReplyCardContent
        reply={reply}
        isLast={isLast && levelReplies.length === 0}
        idx={idx}
        isReplyPage={isReplyPage}
        userName={user.name}
        updatedDate={updatedDate}
        content={content}
      />
      {rereplies.map((rereply: RereplyType, idx: number) => (
        <Fragment key={`rereply-${rereply.idx}`}>
          <ReplyCardContent
            reply={reply}
            isLast={isLast && idx === levelReplies.length - 1}
            isRereply
            isReplyPage={isReplyPage}
            handleShowMoreClick={handleShowMoreClick}
            userName={rereply.user.name}
            updatedDate={rereply.updatedDate}
            content={rereply.content}
          />
        </Fragment>
      ))}
      {shortened && levelReplies.length > 3 && (
        <ShowMoreButton onClick={handleShowMoreClick}>
          더보기
          <DownIcon />
        </ShowMoreButton>
      )}
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
  cursor: isRereply ? 'pointer' : 'default',
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

const ShowMoreButton = styled('button')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',
  borderBottom: `1px solid ${palette.grey[300]}`,
  width: '100%',
  height: 52,
  backgroundcolor: palette.grey[200],
  color: palette.black,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  textDecoration: 'none',
  gap: 4,
  cursor: 'pointer',
  '& svg': {
    width: 20,
    height: 20,
  },
  '& path': {
    fill: palette.black,
  },
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
