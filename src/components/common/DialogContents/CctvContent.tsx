import { useState } from 'react';
import { observer } from 'mobx-react';
import ReactPlayer from 'react-player';
import { IconButton, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { CctvType } from 'types/typeBundle';
import leftIcon from 'assets/icons/previous-icon.svg';
import rightIcon from 'assets/icons/next-icon.svg';

const CctvContent = observer(() => {
  const [cctvIdx, setCctvIdx] = useState<number>(0);
  const { CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const SELECTED_CIRCLE_STYLE: { backgroundColor: string } = {
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };

  const handleCircleClick = (idx: number) => {
    setCctvIdx(idx);
  };

  const moveToPrevCctv = () => {
    setCctvIdx(cctvIdx - 1);
  };

  const moveToNextCctv = () => {
    setCctvIdx(cctvIdx + 1);
  };

  return (
    <Wrap>
      <ReactPlayer
        playing
        muted
        width={'20rem'}
        height={200}
        url={CustomDialogStore?.cctvList[cctvIdx]?.src || ''}
      />
      <DescriptionWrap>
        <CustomIconButton cloudy={cctvIdx === 0} disabled={cctvIdx === 0} onClick={moveToPrevCctv}>
          <img src={leftIcon} alt='left' />
        </CustomIconButton>
        <Content>{CustomDialogStore?.cctvList[cctvIdx]?.cctvname}</Content>
        <CustomIconButton
          cloudy={cctvIdx === CustomDialogStore.cctvList.length - 1}
          disabled={cctvIdx === CustomDialogStore.cctvList.length - 1}
          onClick={moveToNextCctv}
        >
          <img src={rightIcon} alt='right' />
        </CustomIconButton>
      </DescriptionWrap>
      <PageCircleWrap>
        {CustomDialogStore.cctvList.map((_: CctvType, idx: number) => (
          <PageCircle
            isDarkTheme={isDarkTheme}
            selectedCircleStyle={cctvIdx === idx ? SELECTED_CIRCLE_STYLE : {}}
            key={`cctv-page-${idx}`}
            onClick={() => handleCircleClick(idx)}
          />
        ))}
      </PageCircleWrap>
    </Wrap>
  );
});

export default CctvContent;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  '& button': {
    padding: 0,
  },
});

const DescriptionWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Content = styled('span')({
  position: 'relative',
  fontSize: 14,
  fontWeight: 400,
  zIndex: 2,
});

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'cloudy',
})<{ cloudy: boolean }>(({ cloudy }) => ({
  opacity: cloudy ? 0.3 : undefined,
}));

const PageCircleWrap = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 8,
  width: '100%',
  gap: 8,
});

const PageCircle = styled('div', {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'selectedCircleStyle'].includes(prop),
})<{ isDarkTheme: boolean; selectedCircleStyle: object }>(
  ({ isDarkTheme, selectedCircleStyle }) => ({
    borderRadius: '50%',
    width: 6,
    height: 6,
    backgroundColor: palette.grey[isDarkTheme ? 600 : 300],
    cursor: 'pointer',
    ...selectedCircleStyle,
  })
);
