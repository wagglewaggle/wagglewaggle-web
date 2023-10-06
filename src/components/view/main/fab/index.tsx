import { useState } from 'react';
import * as S from './styled';
import { useOptimize } from 'util/';
import { palette } from 'constants/';

type PropsType = {
  tooltipOff?: boolean;
};

const Fab = (props: PropsType) => {
  const { tooltipOff } = props;
  const [openTooltip, setOpenTooltip] = useState<boolean>(true);
  const AB_TEST_VARIANT = useOptimize();

  const handleCloseClick = () => {
    setOpenTooltip(false);
  };

  const handleClickMovePage = () => {
    window.open(
      AB_TEST_VARIANT === 0
        ? 'https://docs.google.com/forms/d/e/1FAIpQLSeuWiDM-JmQO8jYih4rxlbwzoSEx31rGyfrYOtN6ezYb5YLFA/viewform?usp=sf_link'
        : 'https://docs.google.com/forms/d/e/1FAIpQLSdXxVFrhcAYeNghxrtVy0JA4AJwpDFOl4eCcR8E1pUBG1r7WQ/viewform?usp=sf_link',
      '_blank'
    );
  };

  const floatingButtonElement = (
    <S.FloatingButton onClick={handleClickMovePage}>
      <S.ChatIcon />
    </S.FloatingButton>
  );

  if (tooltipOff) return floatingButtonElement;

  return (
    <S.FabTooltip
      arrow
      open={openTooltip}
      leaveDelay={200}
      placement='left'
      title={
        <S.TooltipText>
          설문 참여 시 <S.EmphTooltipText>스타벅스 쿠폰</S.EmphTooltipText> 랜덤 제공
          <S.CloseIcon onClick={handleCloseClick} />
        </S.TooltipText>
      }
      slotProps={tooltipProps}
    >
      {floatingButtonElement}
    </S.FabTooltip>
  );
};

export default Fab;

const tooltipProps = {
  tooltip: {
    sx: {
      padding: '0.75rem 1rem',
      backgroundColor: palette.white,
      fontFamily: 'Pretendard Variable',
    },
  },
  arrow: {
    sx: {
      '&:before': {
        backgroundColor: palette.white,
      },
    },
  },
  popper: {
    sx: {
      zIndex: 1150,
      boxShadow:
        '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    },
  },
};
