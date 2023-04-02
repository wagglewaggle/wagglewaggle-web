import { styled } from '@mui/material';
import { CustomIconButton } from 'components/common/HeaderContents/common';
import { palette } from 'constants/';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

type PropsType = {
  handleLeftClick: () => void;
  title: string;
  includesBorderBottom: boolean;
};

const ProfileHeader = (props: PropsType) => {
  const { handleLeftClick, title, includesBorderBottom } = props;

  return (
    <CustomHeader includesBorderBottom={includesBorderBottom}>
      <CustomIconButton onClick={handleLeftClick}>
        <LeftIcon />
      </CustomIconButton>
      <Title>{title}</Title>
      <Dummy />
    </CustomHeader>
  );
};

export default ProfileHeader;

const CustomHeader = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'includesBorderBottom',
})<{ includesBorderBottom: boolean }>(({ includesBorderBottom }) => ({
  position: 'fixed',
  top: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: includesBorderBottom ? `1px solid ${palette.grey[300]}` : 'none',
  padding: '12px 24px',
  width: 'calc(100% - 48px)',
  maxWidth: 382,
  height: 28,
  backgroundColor: palette.white,
  zIndex: 10,
}));

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
