import { useState } from 'react';
import * as S from './styled';
import { palette } from 'constants/';

type PropsType = {
  tooltipOff?: boolean;
};

const Fab = (props: PropsType) => {
  const { tooltipOff } = props;
  const [openTooltip, setOpenTooltip] = useState<boolean>(true);

  const handleCloseClick = () => {
    setOpenTooltip(false);
  };

  const floatingButtonElement = (
    <S.FloatingButton>
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
};
