import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import LeftButton from './LeftButton';
import { CustomIconButton } from './common';
import axiosRequest from 'api/axiosRequest';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';
import { ReactComponent as PersonIcon } from 'assets/icons/person-icon.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';

type PropsType = {
  isExpanded: boolean;
  requestType: 'KT' | 'SKT';
  placeName: string;
  navigateToHome?: () => void;
  handleSearchClick?: () => void;
};

const MapHeader = (props: PropsType) => {
  const { isExpanded, requestType, placeName, navigateToHome, handleSearchClick } = props;
  const { LocationStore } = useStore().MobxStore;
  const { pathname } = useLocation();

  const handleHeartClick = async () => {
    const pathnameArr = pathname.split('/');
    const placeIdx = Number(pathnameArr[pathnameArr.length - 1]);
    const requestParams = { idx: placeIdx, type: requestType };
    const pinned = LocationStore.currentLocationPinned;
    pinned
      ? await axiosRequest('delete', 'pin-place', requestParams)
      : await axiosRequest('post', 'pin-place', requestParams);
    LocationStore.handlePinChange(pinned);
  };

  return (
    <>
      {!isExpanded ? (
        <>
          <Logo onClick={navigateToHome} />
          <SubHeader>
            <CustomIconButton onClick={handleSearchClick}>
              <SearchIcon />
            </CustomIconButton>
            <CustomIconButton>
              <PersonIcon />
            </CustomIconButton>
          </SubHeader>
        </>
      ) : (
        <>
          <SubHeader>
            <LeftButton isExpanded={isExpanded} />
            {placeName}
          </SubHeader>
          <CustomIconButton pinned={LocationStore.currentLocationPinned} onClick={handleHeartClick}>
            <HeartIcon />
          </CustomIconButton>
        </>
      )}
    </>
  );
};

export default observer(MapHeader);

const SubHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  gap: 8,
});
