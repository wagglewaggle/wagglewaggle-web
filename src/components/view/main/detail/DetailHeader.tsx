import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { bgPaths, locationNames } from 'constants/';
import { CctvContent } from 'components/common/DialogContents';
import { LocationDataType } from 'types/typeBundle';
import { H } from './styled';
import { useStore } from 'stores';
import { useOptimize } from 'util/';
import leftIcon from 'assets/icons/left-icon.svg';

interface propsType {
  locationData: LocationDataType | null;
}

const DetailHeader = observer((props: propsType) => {
  const { locationData } = props;
  const [bgPath, setBgPath] = useState<string>('');
  const { ThemeStore, CustomDialogStore } = useStore().MobxStore;
  const { cctvList } = CustomDialogStore;
  const navigate = useNavigate();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const AB_TEST_VARIANT = useOptimize();

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

  return (
    <>
      <H.HeaderArea>
        <H.CustomIconButton isDarkTheme={isDarkTheme} onClick={handleBackClick}>
          <img src={leftIcon} alt='left' />
        </H.CustomIconButton>
        {locationNames[locationData?.name ?? ''] ?? locationData?.name}
        <H.Dummy />
      </H.HeaderArea>
      {AB_TEST_VARIANT === 1 && cctvList.length > 0 ? (
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
