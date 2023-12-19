import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import lottie from 'lottie-web';
import { bgPaths, locationNames } from 'constants/';
import { LocationDataType } from 'types/typeBundle';
import { CctvContent } from 'components/common/DialogContents';
import { H } from './styled';
import { useStore } from 'stores';
import leftIcon from 'assets/icons/left-icon.svg';

interface propsType {
  locationData: LocationDataType | null;
}

const DetailHeader = observer((props: propsType) => {
  const { locationData } = props;
  const [bgPath, setBgPath] = useState<string>('');
  const lottieContainer = useRef<HTMLDivElement>(null);
  const { ThemeStore, CustomDialogStore, ScreenSizeStore } = useStore().MobxStore;
  const { cctvList } = CustomDialogStore;
  const navigate = useNavigate();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleBackClick = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!locationData?.cctvs) return;
    CustomDialogStore.setCctvLists(locationData.cctvs);
  }, [CustomDialogStore, locationData?.cctvs]);

  useEffect(() => {
    if (!bgPaths[locationData?.name || '']) return;
    setBgPath(
      `${require(`assets/detailBg/${ThemeStore.theme}/${
        bgPaths[locationData?.name || ''] || 'Street'
      }/${locationData?.population?.level || 'NORMAL'}.png`)}`
    );
  }, [ThemeStore.theme, locationData?.name, locationData?.population]);

  useEffect(() => {
    if (!lottieContainer.current) return;
    const introAnimation = lottie.loadAnimation({
      container: lottieContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require(`assets/lottie/${ThemeStore.theme}/Detail.json`),
    });
    return () => introAnimation.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ScreenSizeStore.screenType, lottieContainer.current]);

  return (
    <>
      <H.HeaderArea>
        <H.CustomIconButton isDarkTheme={isDarkTheme} onClick={handleBackClick}>
          <img src={leftIcon} alt='left' />
        </H.CustomIconButton>
        {locationNames[locationData?.name ?? ''] ?? locationData?.name}
        <H.Dummy />
      </H.HeaderArea>
      <H.Lottie ref={lottieContainer} isCctv={cctvList.length > 0} />
      {cctvList.length > 0 ? (
        <H.CctvWrap>
          <CctvContent />
        </H.CctvWrap>
      ) : (
        <H.ContentArea src={bgPath === '' ? undefined : bgPath} alt='Header' />
      )}
    </>
  );
});

export default DetailHeader;
