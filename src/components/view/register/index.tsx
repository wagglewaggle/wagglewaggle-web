import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, styled } from '@mui/material';
import { palette } from 'constants/';
import axiosRequest from 'api/axiosRequest';
import defaultImage from 'assets/icons/register/default-photo.png';
import cancelButton from 'assets/icons/register/cancel-button.png';
import errorIcon from 'assets/icons/register/error-icon.png';
import okIcon from 'assets/icons/register/ok-icon.png';

type NicknameStatusType = 'empty' | 'dup' | 'long' | 'ok';

let debouncer: NodeJS.Timeout;
const Register = () => {
  const [profilePicture, setProfilePicture] = useState<string>(defaultImage);
  const [nickname, setNickname] = useState<string>('');
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatusType>('empty');
  const [serverErrorMessage, setServerErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  const checkNicknameStatus = async (nickname: string) => {
    if (nickname.length > 8) {
      setNicknameStatus('long');
      return;
    }
    if (nickname.length === 0) {
      setNicknameStatus('empty');
      return;
    }
    const response = await axiosRequest('get', 'user/validate/nickname', { nickname });
    if (response?.data) {
      setServerErrorMessage(response.data.message);
      setNicknameStatus('dup');
      return;
    }
    setServerErrorMessage('');
    setNicknameStatus('ok');
  };

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    debouncer && clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      checkNicknameStatus(newNickname);
    }, 500);
  };

  const handleProfileCancelClick = () => {
    setProfilePicture(defaultImage);
  };

  const handleNicknameCancelClick = () => {
    setNickname('');
    setNicknameStatus('empty');
  };

  const handleStartClick = async () => {
    if (nicknameStatus !== 'ok') return;
    await axiosRequest('put', 'user/setting', { nickname });
    navigate('/map');
  };

  return (
    <Wrap>
      프로필 설정
      <PictureWrap>
        <ProfilePicture src={profilePicture} alt='profile-picture' />
        <CancelButton
          src={cancelButton}
          variant='profile'
          alt='cancel-button'
          onClick={handleProfileCancelClick}
        />
      </PictureWrap>
      <NicknameWrap>
        닉네임
        <CustomInput
          value={nickname}
          disableUnderline
          placeholder='닉네임은 9자 이내로 적어주세요.'
          onChange={handleNicknameChange}
          endAdornment={
            nickname.length > 0 ? (
              <CancelButton
                src={cancelButton}
                variant='nickname'
                alt='cancel-button'
                onClick={handleNicknameCancelClick}
              />
            ) : (
              <></>
            )
          }
        />
        <NicknameStatusWrap status={nicknameStatus}>
          {nicknameStatus !== 'empty' && (
            <FeedbackIcon src={nicknameStatus === 'ok' ? okIcon : errorIcon} alt='feedback-icon' />
          )}
          {nicknameStatus === 'dup' ? (
            <>{serverErrorMessage}</>
          ) : nicknameStatus === 'long' ? (
            '닉네임은 최대 9글자를 초과할 수 없습니다.'
          ) : nicknameStatus === 'ok' ? (
            '사용 가능한 닉네임입니다.'
          ) : (
            ''
          )}
        </NicknameStatusWrap>
      </NicknameWrap>
      <ButtonWrap>
        <StartButton onClick={handleStartClick} status={nicknameStatus}>
          와글와글 시작하기
        </StartButton>
      </ButtonWrap>
    </Wrap>
  );
};

export default Register;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '12px 0 24px',
  width: 327,
  maxWidth: 327,
  height: 'calc(100vh - 36px)',
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const PictureWrap = styled('div')({
  margin: '40px 0',
});

const ProfilePicture = styled('img')({
  width: 88,
  height: 88,
});

const NicknameWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  color: palette.black,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
  gap: 8,
});

const CustomInput = styled(Input)({
  borderRadius: 4,
  border: 'none',
  padding: '12px 16px',
  marginTop: 8,
  width: '100%',
  backgroundColor: palette.grey[200],
  color: palette.black,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  '& input': {
    padding: 0,
  },
  '&::placeholder': {
    color: palette.grey[400],
  },
});

const CancelButton = styled('img', {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ variant: 'profile' | 'nickname' }>(({ variant }) => ({
  position: variant === 'profile' ? 'absolute' : 'initial',
  width: variant === 'profile' ? 24 : 18,
  height: variant === 'profile' ? 24 : 18,
  transform: variant === 'profile' ? 'translate(-24px, 64px)' : 'initial',
  cursor: 'pointer',
}));

const NicknameStatusWrap = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ status: NicknameStatusType }>(({ status }) => ({
  display: 'flex',
  color: status === 'ok' ? palette.green : palette.red,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 4,
}));

const FeedbackIcon = styled('img')({
  width: 18,
  height: 18,
});

const ButtonWrap = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
  flex: 1,
  width: '100%',
});

const StartButton = styled(Button, {
  shouldForwardProp: (prop: string) => prop !== 'variant',
})<{ status: NicknameStatusType }>(({ status }) => ({
  width: '100%',
  height: 52,
  color: status === 'ok' ? palette.white : palette.grey[300],
  backgroundColor: status === 'ok' ? palette.violet : palette.grey[500],
  '&:hover': {
    color: status === 'ok' ? palette.white : palette.grey[300],
    backgroundColor: status === 'ok' ? palette.violet : palette.grey[500],
  },
}));
