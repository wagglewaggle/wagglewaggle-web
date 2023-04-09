import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import _ from 'lodash';
import { ReviewList } from 'components/common';
import { useStore } from 'stores';
import { RequestType } from 'types/typeBundle';
import { palette } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import { ReactComponent as RightIcon } from 'assets/icons/right-icon.svg';

const RealtimeReviews = () => {
  const { pathname } = useLocation();
  const { ThemeStore, ReviewStore, LocationStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDarkTheme = ThemeStore.theme === 'dark';
  const { placesData } = LocationStore;
  const placeName = searchParams.get('name') ?? '';
  const pathnameArr = pathname.split('/');
  const placeIdx = Number(pathnameArr[3]) || Number(pathnameArr[2]);
  const requestType: RequestType | undefined = placesData.find(
    (data) => data.name === placeName
  )?.type;

  const handleOpenReviewPage = () => {
    navigate(`/review/${placeIdx}?name=${placeName}`);
  };

  const getReviews = useCallback(
    async (placeIdx: number) => {
      if (!requestType || !placeIdx) return;
      const response = await axiosRequest('get', `${requestType}/${placeIdx}/review-post`);
      ReviewStore.setReviews(response?.data.list);
    },
    [requestType, ReviewStore]
  );

  useEffect(() => {
    if (!placeName) return;
    getReviews(placeIdx);
  }, [getReviews, placeIdx, placeName]);

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
      <ReviewList reviews={_.cloneDeep(ReviewStore.reviews).slice(0, 3)} fromBottomSheet />
    </Wrap>
  );
};

export default observer(RealtimeReviews);

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'reviewCount'].includes(prop),
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 0 16px',
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
