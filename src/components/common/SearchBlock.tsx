import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import CustomCloseIcon from './CustomCloseIcon';
import { palette } from 'constants/';
import { useStore } from 'stores';

interface propsType {
  title: string;
  blockList: string[];
  onClickRemoveAll: () => void;
  onClickRemoveOne: (list: string) => void;
  handleWordClick: (searchWord: string) => void;
}

const SearchBlock = observer((props: propsType) => {
  const { title, blockList, onClickRemoveAll, onClickRemoveOne, handleWordClick } = props;
  const { ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  const handleListClick = (word: string) => {
    handleWordClick(word);
  };

  const handleIconClick = (list: string) => {
    onClickRemoveOne(list);
  };

  return (
    <Wrap>
      <Header>
        <Title>{title}</Title>
        {blockList.length > 0 && (
          <RemoveButton onClick={onClickRemoveAll}>모두 지우기</RemoveButton>
        )}
      </Header>
      {blockList.length > 0 ? (
        blockList.map((list: string, idx: number) => (
          <ListWrap key={`search-list-${idx}`}>
            <List onClick={() => handleListClick(list)}>{list}</List>
            <CustomCloseIcon handleIconClick={() => handleIconClick(list)} />
          </ListWrap>
        ))
      ) : (
        <EmptyData isDarkTheme={isDarkTheme}>{`${title}가 없어요.`}</EmptyData>
      )}
    </Wrap>
  );
});

export default SearchBlock;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 24,
});

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '15px 0',
});

const Title = styled('span')({
  fontSize: 18,
  fontWeight: 600,
});

const RemoveButton = styled('button')({
  border: 0,
  padding: 0,
  color: palette.black,
  backgroundColor: palette.transparent,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
});

const ListWrap = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
});

const List = styled('div')({
  display: 'block',
  alignItems: 'center',
  flexGrow: 1,
  padding: '5px 0',
  maxWidth: '95%',
  height: 26,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '30px',
  cursor: 'pointer',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const EmptyData = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  marginTop: 9,
  color: palette.grey[isDarkTheme ? 400 : 500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
}));
