import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material';
import ReviewCardHeader from './ReviewCardHeader';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ReviewType } from 'types/typeBundle';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  review: ReviewType;
  shouldIncludeOnClick?: boolean;
  isDetail?: boolean;
  disableBottom?: boolean;
}

const ReviewCard = (props: PropsType) => {
  const { review, shouldIncludeOnClick, isDetail, disableBottom } = props;
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { writer, updatedDate, content, pinReviewPostCount, replyCount, isPin, place, idx } =
    review;
  const { ReviewStore } = useStore().MobxStore;

  const handleClick = () => {
    if (!shouldIncludeOnClick) return;
    navigate(`${pathname}/${place.type}/${idx}${search}`);
  };

  const handleWriteReplyClick = () => {
    if (!isDetail) return;
    ReviewStore.setReplyStatus({ writeMode: true });
  };

  return (
    <ReviewWrap isDetail={isDetail} disableBottom={disableBottom} onClick={handleClick}>
      <ReviewCardHeader
        profilePhoto={defaultPhoto}
        userName={writer.nickname}
        updatedDate={updatedDate}
        removeOptions
      />
      <ReviewContent isDetail={isDetail}>{content}</ReviewContent>
      <IconsInfoWrap>
        <IconsWrap isPinned={isPin}>
          <HeartIcon /> {String(pinReviewPostCount).padStart(2, '0')}
        </IconsWrap>
        <IconsWrap onClick={handleWriteReplyClick}>
          <ChatIcon /> {String(replyCount).padStart(2, '0')}
        </IconsWrap>
      </IconsInfoWrap>
    </ReviewWrap>
  );
};

export default ReviewCard;

const ReviewWrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isDetail', 'disableBottom'].includes(prop),
})<{ isDetail?: boolean; disableBottom?: boolean }>(({ isDetail, disableBottom }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: isDetail || disableBottom ? 'none' : `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  width: 'calc(100% - 48px)',
  gap: 8,
}));

const ReviewContent = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDetail',
})<{ isDetail?: boolean }>(({ isDetail }) => ({
  display: '-webkit-box',
  width: '100%',
  maxHeight: isDetail ? 'none' : 60,
  height: isDetail ? 'auto' : 60,
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  overflow: isDetail ? 'unset' : 'hidden',
  textOverflow: isDetail ? 'unset' : 'ellipsis',
  whiteSpace: 'pre-wrap',
  WebkitLineClamp: isDetail ? 'unset' : 3,
  WebkitBoxOrient: isDetail ? 'unset' : 'vertical',
}));

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
  cursor: 'pointer',
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));
