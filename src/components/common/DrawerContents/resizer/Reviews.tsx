import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { IconButton, Avatar, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette, locationNames, locationRequestTypes } from 'constants/';
import { ReviewType } from 'types/typeBundle';
import axiosRequest from 'api/axiosRequest';
import { ReactComponent as RightIcon } from 'assets/icons/right-icon.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';
import { ReactComponent as ChatIcon } from 'assets/icons/drawer/chat.svg';
import defaultPhoto from 'assets/icons/register/default-photo.png';

const Reviews = () => {
  const { pathname, search } = useLocation();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme = ThemeStore.theme === 'dark';
  const placeName: string = decodeURI(search).replace('?name=', '');
  const requestType: 'SKT' | 'KT' = locationRequestTypes.skt.includes(
    locationNames[placeName] || placeName
  )
    ? 'SKT'
    : 'KT';

  const handleOpenReviewPage = () => {};

  const getReviews = useCallback(
    async (placeIdx: number) => {
      if (!requestType || !placeIdx) return;
      const response = await axiosRequest('get', `${requestType}/${placeIdx}/review-post`);
      setReviews(response?.data.list.slice(0, 3));
    },
    [requestType]
  );

  const getTimeDiff = (updatedDate: string) => {
    const newTimePassed: number = Math.round(
      (new Date().getTime() - new Date(updatedDate || '').getTime()) / 60000
    );
    return newTimePassed >= 60
      ? `${Math.floor(newTimePassed / 60)}시간 전`
      : `${newTimePassed}분 전`;
  };

  useEffect(() => {
    const pathnameArr = pathname.split('/');
    const placeIdx = Number(pathnameArr[pathnameArr.length - 1]);
    getReviews(placeIdx);
  }, [getReviews, pathname]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <Header>
        <span>실시간 리뷰</span>
        <ButtonArea onClick={handleOpenReviewPage}>
          더보기
          <CustomIconButton>
            <RightIcon />
          </CustomIconButton>
        </ButtonArea>
      </Header>
      {reviews.length === 0 ? (
        <NoReviewWrap>
          <NoReviewHeader>작성된 리뷰가 없어요.</NoReviewHeader>
          <NoReviewContent>{`지금 해당 장소에 계시다면\r\n첫번째 리뷰를 남겨주세요 🥰`}</NoReviewContent>
        </NoReviewWrap>
      ) : (
        <ReviewsWrap>
          {reviews.map((review: ReviewType) => (
            <ReviewWrap>
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
      )}
    </Wrap>
  );
};

export default Reviews;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'reviewCount'].includes(prop),
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 0 16px',
  width: '100%',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
}));

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  marginBottom: 16,
  width: 'calc(100% - 48px)',
  '& span': {
    fontSize: 18,
    fontWeight: 600,
  },
});

const ButtonArea = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 14,
  fontWeight: 600,
  gap: 4,
});

const CustomIconButton = styled(IconButton)({
  padding: 0,
  '& svg': {
    width: 16,
    height: 16,
  },
  '& path': {
    fill: palette.black,
  },
});

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

const NoReviewWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 24px',
  marginTop: 16,
  gap: 8,
});

const NoReviewHeader = styled('span')({
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const NoReviewContent = styled('span')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
});
