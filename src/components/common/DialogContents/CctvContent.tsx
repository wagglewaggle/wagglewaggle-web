import { useState } from 'react';
import { observer } from 'mobx-react';
import ReactPlayer from 'react-player';
import { IconButton, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';
import { CctvType } from 'types/typeBundle';
import leftIcon from 'assets/icons/previous-icon.svg';
import rightIcon from 'assets/icons/next-icon.svg';

type PropsType = {
  isDialog?: boolean;
};

const CctvContent = observer((props: PropsType) => {
  const { isDialog } = props;
  const [cctvIdx, setCctvIdx] = useState<number>(0);
  const { CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const SELECTED_CIRCLE_STYLE: { backgroundColor: string } = {
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };
  const url = CustomDialogStore?.cctvList[cctvIdx]?.src;
  const isUtic =
    !url.startsWith('https://www.youtube.com') && !url.startsWith('https://md.kbs.co.kr');

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
      <PlayerWrap>
        {isUtic && <UticInfo>경찰청 (UTIC) 제공</UticInfo>}
        <ReactPlayer
          playing
          muted
          width={375}
          height={209}
          url={CustomDialogStore?.cctvList[cctvIdx]?.src || ''}
        />
      </PlayerWrap>
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
      <PageCircleWrap isDialog={isDialog}>
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
  width: '100%',
  gap: 16,
  '& button': {
    padding: 0,
  },
});

const PlayerWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 209,
  backgroundColor: palette.black,
});

const UticInfo = styled('span')({
  position: 'absolute',
  top: '4.5rem',
  color: palette.white,
  fontSize: '0.75rem',
  fontWeight: 500,
});

const DescriptionWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '0 1.5rem 1rem',
});

const Content = styled('span')({
  position: 'relative',
  fontSize: '0.875rem',
  fontWeight: 400,
  color: palette.white,
  lineHeight: '1.25rem',
  zIndex: 2,
});

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'cloudy',
})<{ cloudy: boolean }>(({ cloudy }) => ({
  opacity: cloudy ? 0.3 : undefined,
}));

const PageCircleWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDialog',
})<{ isDialog?: boolean }>(({ isDialog }) => ({
  position: isDialog ? 'unset' : 'absolute',
  top: '15rem',
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  gap: '0.5rem',
  zIndex: 5,
}));

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
