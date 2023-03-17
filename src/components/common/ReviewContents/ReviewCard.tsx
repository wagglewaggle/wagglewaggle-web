import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, styled } from '@mui/material';
import { palette } from 'constants/';
import { ReviewType } from 'types/typeBundle';
import { getTimeDiff } from 'util/';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  review: ReviewType;
  shouldIncludeOnClick?: boolean;
  isDetail?: boolean;
}

const ReviewCard = (props: PropsType) => {
  const { review, shouldIncludeOnClick, isDetail } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (review: ReviewType) => {
    if (!shouldIncludeOnClick) return;
    navigate(`${pathname}/${review.place.type}/${review.idx}`);
  };

  return (
    <ReviewWrap isDetail={isDetail} onClick={() => handleClick(review)}>
      <ReviewHeader>
        <CustomAvatar alt='profile-pic' src={defaultPhoto} />
        <WriterInfoWrap>
          <span>{review.writer.nickname}</span>
          <span>{`${getTimeDiff(review.updatedDate)} \u00B7 조회 ${review.view}`}</span>
        </WriterInfoWrap>
      </ReviewHeader>
      <ReviewContent isDetail={isDetail}>{review.content}</ReviewContent>
      <IconsInfoWrap>
        <IconsWrap isPinned={review.isPin}>
          <HeartIcon /> {String(review.pinReviewPostCount).padStart(2, '0')}
        </IconsWrap>
        <IconsWrap>
          <ChatIcon /> {String(review.replyCount).padStart(2, '0')}
        </IconsWrap>
      </IconsInfoWrap>
    </ReviewWrap>
  );
};

export default ReviewCard;

const ReviewWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDetail',
})<{ isDetail?: boolean }>(({ isDetail }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: isDetail ? 'none' : `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  width: 'calc(100% - 48px)',
  gap: 8,
}));

const ReviewHeader = styled('div')({
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
  '& path': {
    fill: isPinned ? palette.violet : palette.grey[400],
  },
}));
