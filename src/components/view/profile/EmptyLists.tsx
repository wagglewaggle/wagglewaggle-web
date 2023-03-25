import { styled } from '@mui/material';
import { palette } from 'constants/';

type PropsType = {
  title: string;
  content: string;
};

const EmptyLists = (props: PropsType) => {
  const { title, content } = props;

  return (
    <NoReviewWrap>
      <NoReviewHeader>{title}</NoReviewHeader>
      <NoReviewContent>{content}</NoReviewContent>
    </NoReviewWrap>
  );
};

export default EmptyLists;

const NoReviewWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px 24px',
  marginTop: 16,
  gap: 8,
});

const NoReviewHeader = styled('span')({
  color: palette.black,
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const NoReviewContent = styled('span')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
});
