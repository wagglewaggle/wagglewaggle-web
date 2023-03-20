import { observer } from 'mobx-react';
import { styled } from '@mui/material';
import { useStore } from 'stores';
import { palette } from 'constants/';

const NotificationContent = () => {
  const { CustomDialogStore } = useStore().MobxStore;
  const { notiOptions } = CustomDialogStore;

  return (
    <>
      <Wrap>
        <Title>{notiOptions.title}</Title>
        <Content>{notiOptions.content}</Content>
        <Content isSubcontent>{notiOptions.subContent ?? ''}</Content>
      </Wrap>
      <ButtonsWrap>
        {notiOptions.leftButton && (
          <CustomButton isLeft onClick={notiOptions.leftButton.handleClick}>
            {notiOptions.leftButton.title}
          </CustomButton>
        )}
        <CustomButton
          noLeftButton={!notiOptions.leftButton}
          onClick={notiOptions.rightButton.handleClick}
        >
          {notiOptions.rightButton.title}
        </CustomButton>
      </ButtonsWrap>
    </>
  );
};

export default observer(NotificationContent);

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px 8px 0 0',
  padding: '20px 24px 0',
  width: 263,
  backgroundColor: palette.white,
  textAlign: 'center',
});

const Title = styled('div')({
  marginBottom: '16px',
  fontSize: 18,
  fontWeight: 600,
  wordBreak: 'keep-all',
  lineHeight: '24px',
});

const Content = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'isSubcontent',
})<{ isSubcontent?: boolean }>(({ isSubcontent }) => ({
  padding: isSubcontent ? '4px 0 24px' : 0,
  color: isSubcontent ? palette.grey[500] : palette.black,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
}));

const ButtonsWrap = styled('div')({
  display: 'flex',
  borderRadius: '0 0 8px 8px',
  width: 311,
  height: 52,
});

const CustomButton = styled('button', {
  shouldForwardProp: (prop: string) => !['isLeft', 'noLeftButton'].includes(prop),
})<{ isLeft?: boolean; noLeftButton?: boolean }>(({ isLeft, noLeftButton }) => ({
  border: 'none',
  borderBottomLeftRadius: isLeft || noLeftButton ? 8 : 0,
  borderBottomRightRadius: isLeft ? 0 : 8,
  width: '100%',
  height: 52,
  color: isLeft ? palette.black : palette.white,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  backgroundColor: isLeft ? palette.grey[200] : palette.black,
  cursor: 'pointer',
}));
