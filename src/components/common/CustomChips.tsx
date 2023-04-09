import { useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { styled } from '@mui/material';
import { palette } from 'constants/';
import { useStore } from 'stores';
import { ChipType } from 'types/typeBundle';
import { getChipImage } from 'util/';

interface PropsType {
  handleClickChip: (chip: string) => void;
}

const CustomChips = (props: PropsType) => {
  const { handleClickChip } = props;
  const chipWrapRef = useRef<HTMLDivElement>(null);
  const { ThemeStore, CategoryStore, ScreenSizeStore } = useStore().MobxStore;
  const { selectedCategories } = CategoryStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const CHIPS: ChipType[] = [
    '전체',
    '강변',
    '봄 나들이',
    '골목 및 거리',
    '공원',
    '궁궐',
    '마을',
    '쇼핑몰',
    '지하철',
    '테마파크',
    '해변',
    '기타 지역',
  ];
  const SELECTED_CHIP_STYLE: { border: string; color: string; backgroundColor: string } = {
    border: `1px solid ${isDarkTheme ? palette.white : palette.black}`,
    color: isDarkTheme ? palette.black : palette.white,
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };

  const handleEndScroll = () => {
    if (!chipWrapRef.current) return;
    ScreenSizeStore.setChipScrollPosition(chipWrapRef.current.scrollLeft);
  };

  useEffect(() => {
    if (selectedCategories !== '전체' || !chipWrapRef.current) return;
    chipWrapRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  }, [selectedCategories]);

  useEffect(() => {
    if (!chipWrapRef.current || !ScreenSizeStore.chipScrollPosition) return;
    chipWrapRef.current.scrollTo({ left: ScreenSizeStore.chipScrollPosition });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChipsWrap horizontal innerRef={chipWrapRef} onEndScroll={handleEndScroll}>
      {CHIPS.map((chip, idx: number) => (
        <Chip
          key={`chip-${idx}`}
          isDarkTheme={isDarkTheme}
          selectedStyle={selectedCategories.includes(chip) ? SELECTED_CHIP_STYLE : {}}
          onClick={() => handleClickChip(chip)}
        >
          <CustomChipImage src={getChipImage(chip)} />
          {chip}
        </Chip>
      ))}
    </ChipsWrap>
  );
};

export default observer(CustomChips);

const ChipsWrap = styled(ScrollContainer)({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0 16px',
  height: 32,
  gap: 10,
  cursor: 'pointer',
  userSelect: 'none',
  overflowY: 'hidden',
});

const Chip = styled('div', {
  shouldForwardProp: (prop: string) => !['isDarkTheme', 'selectedStyle'].includes(prop),
})<{ isDarkTheme: boolean; selectedStyle: object }>(({ isDarkTheme, selectedStyle }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 29,
  padding: '8px 12px',
  whiteSpace: 'nowrap',
  fontSize: 14,
  fontWeight: 600,
  border: `1px solid ${palette.grey[isDarkTheme ? 600 : 300]}`,
  color: palette.grey[isDarkTheme ? 400 : 500],
  userSelect: 'none',
  ...selectedStyle,
}));

const CustomChipImage = styled('img')({
  marginRight: 4,
  width: 16,
  height: 16,
  userSelect: 'none',
});
