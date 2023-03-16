import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, styled } from '@mui/material';
import { PlaceStatus } from 'components/common';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { ReactComponent as RightIcon } from 'assets/icons/right-icon.svg';
import personIcon from 'assets/icons/person-icon.svg';
import carIcon from 'assets/icons/car-icon.svg';

const DetailedCongestion = observer(() => {
  const [timePassed, setTimePassed] = useState<string>('');
  const { CustomDialogStore, ThemeStore, LocationStore } = useStore().MobxStore;
  const { locationData } = LocationStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const COMMENTS_BY_STATUS: { [key: string]: string } = {
    VERY_RELAXATION: '날아다닐 수 있어요',
    RELAXATION: '여유롭게 이동할 수 있어요',
    NORMAL: '이동하기 불편하지 않아요',
    CROWDED: '이동 시 기다림이 필요해요',
    VERY_CROWDED: '이동하기 힘들어요',
  };
  const TRAFFIC_TO_COMMENTS: { [key: string]: string } = {
    원활: '날아다닐 수 있어요',
    서행: '이동 시간이 소요될 수 있어요',
    정체: '이동하기 힘들어요',
  };

  const handleOpenDialog = () => {
    CustomDialogStore.openCctvDialog(locationData?.cctvs ?? []);
  };

  useEffect(() => {
    const newTimePassed: number = Math.round(
      (new Date().getTime() - new Date(locationData?.population?.updatedDate || '').getTime()) /
        60000
    );
    setTimePassed(
      newTimePassed >= 60 ? `${Math.floor(newTimePassed / 60)}시간 전` : `${newTimePassed}분 전`
    );
  }, [locationData]);

  return (
    <Wrap isDarkTheme={isDarkTheme}>
      <Header>
        <span>실시간 인구 현황</span>
        <ButtonArea>{timePassed}</ButtonArea>
      </Header>
      <StatusCard variant='person'>
        <StatusLeft>
          <img src={personIcon} alt='person' />
          <StatusDescription>
            <span>인구 현황</span>
            <CommentsWrap isDarkTheme={isDarkTheme}>
              {COMMENTS_BY_STATUS[locationData?.population?.level || 'NORMAL']}
            </CommentsWrap>
          </StatusDescription>
        </StatusLeft>
        <PlaceStatus status={locationData?.population.level || undefined} />
      </StatusCard>
      {locationData?.roadTraffic?.type && (
        <StatusCard variant='traffic'>
          <StatusLeft>
            <img src={carIcon} alt='car' />
            <StatusDescription>
              <span>도로 현황</span>
              <CommentsWrap isDarkTheme={isDarkTheme}>
                {TRAFFIC_TO_COMMENTS[locationData?.roadTraffic?.type || '서행']}
              </CommentsWrap>
            </StatusDescription>
          </StatusLeft>
          <PlaceStatus
            status={locationData?.roadTraffic?.type || undefined}
            comments={{ 원활: '원활', 서행: '서행', 정체: '정체' }}
          />
        </StatusCard>
      )}
      {(locationData?.cctvs || []).length > 0 && (
        <>
          <CustomDivider />
          <CustomButton
            isDarkTheme={isDarkTheme}
            onMouseDown={handleOpenDialog}
            onTouchEnd={handleOpenDialog}
          >
            CCTV
            <RightIcon />
          </CustomButton>
        </>
      )}
    </Wrap>
  );
});

export default DetailedCongestion;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 24px 16px',
  width: 'calc(100% - 48px)',
  backgroundColor: isDarkTheme ? palette.grey[700] : palette.white,
  '& path': {
    fill: isDarkTheme ? palette.white : palette.black,
  },
  '& hr': {
    border: `1px solid ${palette.grey[isDarkTheme ? 600 : 300]}`,
  },
}));

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
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

const StatusCard = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ variant: 'person' | 'traffic' }>(({ variant }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 20,
  margin: variant === 'person' ? '24px 0 0 0' : 0,
  width: '100%',
  fontSize: 14,
  fontWeight: 600,
}));

const StatusLeft = styled('div')({
  display: 'flex',
  gap: 8,
  '& img': {
    borderRadius: '50%',
    padding: 8,
    width: 24,
    height: 24,
    backgroundColor: palette.black,
  },
});

const StatusDescription = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  '& span:last-child': {
    fontWeight: 400,
  },
});

const CommentsWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  color: palette.grey[isDarkTheme ? 400 : 500],
}));

const CustomDivider = styled('hr')({
  width: '100%',
  border: `1px solid ${palette.grey[600]}`,
});

const CustomButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  justifyContent: 'space-between',
  padding: '12px 0',
  width: '100%',
  color: isDarkTheme ? palette.white : palette.black,
  fontWeight: 600,
}));
