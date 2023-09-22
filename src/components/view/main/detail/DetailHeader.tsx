import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { IconButton, styled } from '@mui/material';
import { PlaceStatus } from 'components/common';
import { palette, locationNames, bgPaths } from 'constants/';
import { CategoryType, LocationDataType } from 'types/typeBundle';
import { useStore } from 'stores';
import leftIcon from 'assets/icons/left-icon.svg';

interface propsType {
  locationData: LocationDataType | null;
}

const DetailHeader = observer((props: propsType) => {
  const { locationData } = props;
  const [categories, setCategories] = useState<string>('');
  const [bgPath, setBgPath] = useState<string>('');
  const { LocationStore, ThemeStore } = useStore().MobxStore;
  const navigate = useNavigate();
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleBackClick = () => {
    navigate('/');
  };

  useEffect(() => {
    if (!bgPaths[locationData?.name || '']) return;
    setBgPath(
      `url(${require(`assets/detailBg/${ThemeStore.theme}/${
        bgPaths[locationData?.name || ''] || 'Street'
      }/${locationData?.populations[0].level || 'NORMAL'}.png`)})`
    );
  }, [ThemeStore.theme, locationData?.name, locationData?.populations]);

  useEffect(() => {
    if (!locationData?.name || !LocationStore.categories[locationData.name]) return;
    setCategories(
      LocationStore.categories[locationData.name]
        .map((category: CategoryType) => category.type)
        .join(', ')
    );
  }, [locationData?.name, LocationStore.categories]);

  return (
    <Wrap bgPath={bgPath === '' ? undefined : bgPath}>
      <ButtonArea>
        <CustomIconButton isDarkTheme={isDarkTheme} onClick={handleBackClick}>
          <img src={leftIcon} alt='left' />
        </CustomIconButton>
      </ButtonArea>
      <CategoryName isDarkTheme={isDarkTheme}>{categories}</CategoryName>
      <StatusWrap>
        <Status>
          {`지금 ${locationNames[locationData?.name || ''] || locationData?.name || ''}에
          사람이 `}
          <PlaceStatus
            status={locationData?.populations[0].level || undefined}
            comments={{
              VERY_RELAXATION: '거의 없어요.',
              RELAXATION: '조금 있어요.',
              NORMAL: '적당해요.',
              CROWDED: '많아요.',
              VERY_CROWDED: '너무 많아요.',
            }}
          />
        </Status>
      </StatusWrap>
    </Wrap>
  );
});

export default DetailHeader;

const Wrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'bgPath',
})<{ bgPath: string | undefined }>(({ bgPath }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '0 24px',
  height: 448,
  backgroundImage: bgPath,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  overflowX: 'hidden',
  '& svg': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '767px !important',
    height: '432px !important',
  },
}));

const ButtonArea = styled('div')({
  padding: '12px 0',
  zIndex: 1,
  '& button': {
    padding: 0,
    width: 32,
    height: 32,
    justifyContent: 'flex-start',
  },
});

const CustomIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  filter: isDarkTheme ? 'none' : 'invert(1)',
}));

const CategoryName = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  margin: '8px 0',
  color: palette.grey[isDarkTheme ? 400 : 500],
  fontSize: 12,
  fontWeight: 500,
}));

const StatusWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  whiteSpace: 'pre-line',
  lineHeight: '32px',
});

const Status = styled('div')({
  fontSize: 24,
  fontWeight: 600,
});
