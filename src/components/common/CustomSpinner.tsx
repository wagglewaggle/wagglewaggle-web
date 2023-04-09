import { observer } from 'mobx-react';
import { CircularProgress, styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';

const CustomSpinner = () => {
  const { AxiosStore } = useStore().MobxStore;

  return AxiosStore.requestInProgress ? (
    <Wrap>
      <Spinner size={56} thickness={4} />
    </Wrap>
  ) : (
    <></>
  );
};

export default observer(CustomSpinner);

const Wrap = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  gap: 20,
  zIndex: 2000,
});

const Spinner = styled(CircularProgress)({
  position: 'fixed',
  top: 324,
  color: palette.violet,
});
