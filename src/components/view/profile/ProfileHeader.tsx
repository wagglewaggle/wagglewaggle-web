import { styled } from '@mui/material';
import { CustomIconButton } from 'components/common/HeaderContents/common';
import { palette } from 'constants/';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

type PropsType = {
  handleLeftClick: () => void;
  title: string;
};

const ProfileHeader = (props: PropsType) => {
  const { handleLeftClick, title } = props;

  return (
    <CustomHeader>
      <CustomIconButton onClick={handleLeftClick}>
        <LeftIcon />
      </CustomIconButton>
      <Title>{title}</Title>
      <Dummy />
    </CustomHeader>
  );
};

export default ProfileHeader;

const CustomHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 24px',
  width: 'calc(100% - 48px)',
  height: 28,
});

const Title = styled('span')({
  display: 'flex',
  alignItems: 'center',
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const Dummy = styled('span')({
  minWidth: 24,
  width: 24,
});
