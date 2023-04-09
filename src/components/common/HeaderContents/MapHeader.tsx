import { useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import LeftButton from './LeftButton';
import { CustomIconButton } from './common';
import axiosRequest from 'api/axiosRequest';
import { RequestType } from 'types/typeBundle';
import { locationNames } from 'constants/';
import { ReactComponent as Logo } from 'assets/icons/logo-icon.svg';
import { ReactComponent as SearchIcon } from 'assets/icons/search-icon.svg';
import { ReactComponent as PersonIcon } from 'assets/icons/person-icon.svg';
import { ReactComponent as HeartIcon } from 'assets/icons/drawer/heart.svg';

type PropsType = {
  isExpanded: boolean;
  requestType?: RequestType;
  placeName: string;
  navigateToHome?: () => void;
  handleSearchClick?: () => void;
};

const MapHeader = (props: PropsType) => {
  const { isExpanded, requestType, placeName, navigateToHome, handleSearchClick } = props;
  const { LocationStore, ProfileStore } = useStore().MobxStore;
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const handleHeartClick = async () => {
    if (!requestType) return;
    const pathnameArr = pathname.split('/');
    const placeIdx = Number(pathnameArr[pathnameArr.length - 1]);
    const requestParams = { idx: placeIdx, type: requestType };
    const pinned = LocationStore.currentLocationPinned;
    pinned
      ? await axiosRequest('delete', 'pin-place', requestParams)
      : await axiosRequest('post', 'pin-place', requestParams);
    LocationStore.handlePinChange(pinned);
  };

  const handleProfilePageOpen = () => {
    navigate(`${pathname}${search}`);
    ProfileStore.setProfilePageOpen(true);
  };

  return (
    <>
      {!isExpanded ? (
        <>
          <SubHeader>
            <Logo onClick={navigateToHome} />
          </SubHeader>
          <IconButtonsWrap>
            <CustomIconButton onClick={handleSearchClick}>
              <SearchIcon />
            </CustomIconButton>
            <CustomIconButton onClick={handleProfilePageOpen}>
              <PersonIcon />
            </CustomIconButton>
          </IconButtonsWrap>
        </>
      ) : (
        <>
          <SubHeader>
            <LeftButton isExpanded={isExpanded} />
            {locationNames[placeName] ?? placeName}
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

const IconButtonsWrap = styled('div')({
  display: 'flex',
  gap: 8,
});
