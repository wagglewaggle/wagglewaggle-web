import { observer } from 'mobx-react';
import { Avatar, styled } from '@mui/material';
import { ReviewType } from 'types/typeBundle';
import { palette } from 'constants/';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

interface PropsType {
  reviews: ReviewType[];
  shouldIncludeSwiper?: boolean;
}

const ReviewList = (props: PropsType) => {
  const { reviews } = props;

  const getTimeDiff = (updatedDate: string) => {
    const newTimePassed: number = Math.round(
      (new Date().getTime() - new Date(updatedDate || '').getTime()) / 60000
    );
    return newTimePassed >= 60
      ? `${Math.floor(newTimePassed / 60)}시간 전`
      : `${newTimePassed}분 전`;
  };

  return (
    <ReviewsWrap>
      {reviews.map((review: ReviewType) => (
        <ReviewWrap key={`review-${review.idx}`}>
          <ReviewHeader>
            <CustomAvatar alt='profile-pic' src={defaultPhoto} />
            <WriterInfoWrap>
              <span>{review.writer.nickname}</span>
              <span>{`${getTimeDiff(review.updatedDate)} \u00B7 조회 ${review.view}`}</span>
            </WriterInfoWrap>
          </ReviewHeader>
          <ReviewContent>{review.content}</ReviewContent>
          <IconsInfoWrap>
            <IconsWrap isPinned={review.isPin}>
              <HeartIcon /> {String(review.pinReviewPostCount).padStart(2, '0')}
            </IconsWrap>
            <IconsWrap>
              <ChatIcon /> {String(review.replyCount).padStart(2, '0')}
            </IconsWrap>
          </IconsInfoWrap>
        </ReviewWrap>
      ))}
    </ReviewsWrap>
  );
};

export default observer(ReviewList);

const ReviewsWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const ReviewWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  width: 'calc(100% - 48px)',
  gap: 8,
});

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

const ReviewContent = styled('div')({
  display: '-webkit-box',
  width: '100%',
  maxHeight: 60,
  height: 60,
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
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
