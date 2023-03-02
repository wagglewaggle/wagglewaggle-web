import ScrollContainer from 'react-indiana-drag-scroll';
import { styled } from '@mui/material';
import { palette } from 'constants/';
import { useStore } from 'stores';

interface PropsType {
  selectedCategory: string;
  handleClickChip: (chip: string) => void;
}

const CustomChips = (props: PropsType) => {
  const { selectedCategory, handleClickChip } = props;
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';
  const CHIPS: string[] = [
    '전체',
    '쇼핑몰',
    '공원',
    '골목 및 거리',
    '지하철',
    '궁궐',
    '테마파크',
    '마을',
    '한강',
  ];
  const SELECTED_CHIP_STYLE: { border: string; color: string; backgroundColor: string } = {
    border: `2px solid ${isDarkTheme ? palette.white : palette.black}`,
    color: isDarkTheme ? palette.black : palette.white,
    backgroundColor: isDarkTheme ? palette.white : palette.black,
  };

  return (
    <ChipsWrap horizontal>
      {CHIPS.map((chip: string, idx: number) => (
        <Chip
          key={`chip-${idx}`}
          isDarkTheme={isDarkTheme}
          selectedStyle={selectedCategory === chip ? SELECTED_CHIP_STYLE : {}}
          onClick={() => handleClickChip(chip)}
        >
          {chip}
        </Chip>
      ))}
    </ChipsWrap>
  );
};

export default CustomChips;

const ChipsWrap = styled(ScrollContainer)({
  display: 'flex',
  padding: '8px 0 16px',
  height: 32,
  gap: 10,
  cursor: 'pointer',
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
  ...selectedStyle,
}));
