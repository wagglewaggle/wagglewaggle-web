import { useState, useRef, MouseEvent } from 'react';
import { styled } from '@mui/material';
import { HeaderSelectMenu } from 'components/common/HeaderContents';
import { CustomIconButton } from './common';
import { palette } from 'constants/';
import { handleShareLinkClick } from 'util/';
import { ReactComponent as ShareIcon } from 'assets/icons/drawer/share.svg';
import { ReactComponent as OptionsIcon } from 'assets/icons/drawer/options.svg';
import { ReactComponent as LeftIcon } from 'assets/icons/left-icon.svg';

type PropsType = {
  isMyReview: boolean;
  replyContent?: string;
  handleCloseDrawer: () => void;
};

const ReviewHeader = (props: PropsType) => {
  const { isMyReview, replyContent = '', handleCloseDrawer } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const copyLinkRef = useRef<HTMLInputElement>(null);

  const handleShareClick = () => {
    handleShareLinkClick(copyLinkRef.current);
  };

  const handleOptionsClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e: MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Wrap>
      <SubHeader>
        <CustomIconButton onClick={handleCloseDrawer}>
          <LeftIcon />
        </CustomIconButton>
        <IconsWrap>
          <CustomIconButton onClick={handleShareClick}>
            <ShareIcon />
          </CustomIconButton>
          <HiddenLink ref={copyLinkRef} value={window.location.href} onChange={() => {}} />
          <CustomIconButton onClick={handleOptionsClick}>
            <OptionsIcon />
          </CustomIconButton>
        </IconsWrap>
      </SubHeader>
      <HeaderSelectMenu
        replyContent={replyContent}
        anchorEl={anchorEl}
        isMyReview={isMyReview}
        handleMenuClose={handleMenuClose}
      />
    </Wrap>
  );
};

export default ReviewHeader;

const Wrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  gap: 8,
});

const SubHeader = styled('div')({
  position: 'fixed',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '0 24px',
  width: 'calc(100% - 48px)',
  height: 48,
  minHeight: 48,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  backgroundColor: palette.white,
  gap: 8,
  zIndex: 10,
});

const IconsWrap = styled('div')({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-end',
  gap: 16,
});

const HiddenLink = styled('input')({
  display: 'none',
});
