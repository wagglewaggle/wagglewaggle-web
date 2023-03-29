import { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material';
import ReviewCardHeader from './ReviewCardHeader';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ReplyType, ReviewDetailType, RereplyType } from 'types/typeBundle';
import { ReactComponent as DownIcon } from 'assets/icons/down-icon.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  reply: ReplyType;
  review: ReviewDetailType;
  shortened?: boolean;
  isLast: boolean;
  isReplyPage?: boolean;
}

interface ContentType {
  reply: ReplyType;
  requestUrl: string;
  isLast: boolean;
  isRereply?: boolean;
  handleShowMoreClick?: () => void;
  idx?: number;
  userNickname: string;
  updatedDate: string;
  content: string;
  isReplyPage?: boolean;
}

const ReplyCardContent = (props: ContentType) => {
  const {
    reply,
    requestUrl,
    isLast,
    isRereply,
    handleShowMoreClick = () => {},
    idx,
    userNickname,
    updatedDate,
    content,
  } = props;
  const { ReviewStore } = useStore().MobxStore;
  const isDeleted = reply.status === 'DELETED';

  const handleWriteRereplyClick = () => {
    if (isRereply) return;
    ReviewStore.setSelectedReply(reply);
    ReviewStore.setReplyStatus({ writeMode: true, replyIdx: idx });
  };

  return (
    <ReplyWrap isLast={isLast} isRereply={isRereply} onClick={handleShowMoreClick}>
      <ReviewCardHeader
        requestUrl={requestUrl}
        profilePhoto={defaultPhoto}
        userNickname={userNickname}
        updatedDate={updatedDate}
        removeOptions={isDeleted}
      />
      <ReplyContent>{content}</ReplyContent>
      {!isDeleted && (
        <IconsInfoWrap>
          <IconsWrap isPinned={false}>좋아요 {1 > 0 && String(0).padStart(2, '0')}</IconsWrap>
          {!isRereply && <IconsWrap onClick={handleWriteRereplyClick}>답글쓰기</IconsWrap>}
        </IconsInfoWrap>
      )}
    </ReplyWrap>
  );
};

const ReplyCard = (props: PropsType) => {
  const { reply, review, shortened, isLast, isReplyPage } = props;
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { ReviewStore } = useStore().MobxStore;
  const { user, status, updatedDate, content, levelReplies, idx } = reply;
  const rereplies = levelReplies.slice(0, shortened ? 3 : levelReplies.length);
  if (!review) return <></>;
  const { place, idx: reviewIdx } = review;

  const handleShowMoreClick = () => {
    ReviewStore.setSelectedReply(reply);
    navigate(`${pathname}${search}`);
  };

  return (
    <>
      <ReplyCardContent
        reply={reply}
        requestUrl={`${place.type}/${place.idx}/review-post/${reviewIdx}/reply/${idx}`}
        isLast={isLast && levelReplies.length === 0}
        idx={idx}
        isReplyPage={isReplyPage}
        userNickname={status !== 'DELETED' ? user.nickname : '(알수없음)'}
        updatedDate={updatedDate}
        content={status !== 'DELETED' ? content : '(삭제된 댓글입니다.)'}
      />
      {rereplies.map((rereply: RereplyType, idx: number) => (
        <Fragment key={`rereply-${rereply.idx}`}>
          <ReplyCardContent
            reply={reply}
            requestUrl={`${place.type}/${place.idx}/review-post/${reviewIdx}/reply/${rereply.idx}`}
            isLast={isLast && idx === levelReplies.length - 1}
            isRereply
            isReplyPage={isReplyPage}
            handleShowMoreClick={handleShowMoreClick}
            userNickname={rereply.status !== 'DELETED' ? rereply.user.nickname : '(알수없음)'}
            updatedDate={rereply.updatedDate}
            content={rereply.status !== 'DELETED' ? rereply.content : '(삭제된 댓글입니다.)'}
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
  padding: `20px 24px 20px ${isRereply ? 40 : 24}px`,
  marginBottom: isLast ? 56 : 0,
  width: `calc(100% - ${isRereply ? 64 : 48}px)`,
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
  minHeight: 52,
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
