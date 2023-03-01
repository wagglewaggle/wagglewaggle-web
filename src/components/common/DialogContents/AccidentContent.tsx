import { Fragment } from 'react';
import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { AccidentType } from 'types/typeBundle';
import { palette } from 'constants/';

const AccidentContent = observer(() => {
  const { CustomDialogStore, ThemeStore } = useStore().MobxStore;
  const isDarkTheme: boolean = ThemeStore.theme === 'dark';

  return (
    <>
      {CustomDialogStore.accidentList.map((accident: AccidentType, idx: number) => (
        <Fragment key={`accident-list-${idx}`}>
          <Type isDarkTheme={isDarkTheme}>{accident.type}</Type>
          <Title>{accident.info}</Title>
        </Fragment>
      ))}
    </>
  );
});

export default AccidentContent;

const Type = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isDarkTheme',
})<{ isDarkTheme: boolean }>(({ isDarkTheme }) => ({
  marginBottom: 8,
  color: palette.grey[isDarkTheme ? 400 : 500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
}));

const Title = styled('div')({
  marginBottom: '24px',
  fontSize: 18,
  fontWeight: 600,
  wordBreak: 'keep-all',
  lineHeight: '24px',
});
