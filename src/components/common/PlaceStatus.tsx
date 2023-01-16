import { styled } from '@mui/material';
import { StatusType } from 'types/typeBundle';
import { palette } from 'constants/';

interface propsType {
  status?: StatusType | string;
  comments?: { [key: string]: string };
}

const PlaceStatus = (props: propsType) => {
  const {
    status,
    comments = {
      VERY_RELAXATION: '매우 여유',
      RELAXATION: '여유',
      NORMAL: '보통',
      CROWDED: '붐빔',
      VERY_CROWDED: '매우 붐빔',
    },
  } = props;

  return (
    <>
      {status === 'VERY_RELAXATION' || status === '원활' ? (
        <VeryUncrowded>{comments[status]}</VeryUncrowded>
      ) : status === 'RELAXATION' ? (
        <Uncrowded>{comments[status]}</Uncrowded>
      ) : status === 'NORMAL' || status === '서행' ? (
        <Normal>{comments[status]}</Normal>
      ) : status === 'CROWDED' ? (
        <Crowded>{comments[status]}</Crowded>
      ) : status === 'VERY_CROWDED' || status === '정체' ? (
        <VeryCrowded>{comments[status]}</VeryCrowded>
      ) : (
        <></>
      )}
    </>
  );
};

export default PlaceStatus;

const VeryUncrowded = styled('span')({
  color: palette.blue,
});

const Uncrowded = styled('span')({
  color: palette.green,
});

const Normal = styled('span')({
  color: palette.yellow,
});

const Crowded = styled('span')({
  color: palette.orange,
});

const VeryCrowded = styled('span')({
  color: palette.red,
});
