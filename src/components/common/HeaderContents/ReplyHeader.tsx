import { useState, useRef, MouseEvent } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { LeftButton, HeaderSelectMenu } from 'components/common/HeaderContents';
import { CustomIconButton } from './common';
import { useStore } from 'stores';
import { handleShareLinkClick } from 'util/';
import { ReactComponent as ShareIcon } from 'assets/icons/drawer/share.svg';
import { ReactComponent as OptionsIcon } from 'assets/icons/drawer/options.svg';

type PropsType = {
  placeIdx: number;
  placeName: string;
  search: string;
  isMainReviewPage?: boolean;
  isMyReview: boolean;
};

const ReplyHeader = (props: PropsType) => {
  const { placeIdx, placeName, search, isMainReviewPage, isMyReview } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setLinkCopied] = useState<boolean>(false);
  const copyLinkRef = useRef<HTMLInputElement>(null);
  const { ReviewStore } = useStore().MobxStore;
  const { headerTitleStatus } = ReviewStore;

  const handleShareClick = () => {
    handleShareLinkClick(copyLinkRef.current, setLinkCopied);
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
      <LeftButton
        backUrlInfo={
          ReviewStore.reviewDetail
            ? `/review/${placeIdx}?name=${placeName}`
            : `/map/${placeIdx}${search}`
        }
      />
      {isMainReviewPage ? (
        <>{headerTitleStatus.title}</>
      ) : (
        <>
          <IconsWrap>
            <CustomIconButton onClick={handleShareClick}>
              <ShareIcon />
            </CustomIconButton>
            <HiddenLink ref={copyLinkRef} value={window.location.href} onChange={() => {}} />
            <CustomIconButton onClick={handleOptionsClick}>
              <OptionsIcon />
            </CustomIconButton>
          </IconsWrap>
          <HeaderSelectMenu
            anchorEl={anchorEl}
            isMyReview={isMyReview}
            handleMenuClose={handleMenuClose}
          />
        </>
      )}
    </Wrap>
  );
};

export default observer(ReplyHeader);

const Wrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
  gap: 8,
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