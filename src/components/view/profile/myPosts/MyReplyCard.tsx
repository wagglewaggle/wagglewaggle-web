import { styled } from '@mui/material';
import { MyReplyType, CategoryType, RequestType } from 'types/typeBundle';
import { useStore } from 'stores';
import { getImageSymbol, getTimeDiff, filterBadWords } from 'util/';
import { palette, symbolsComponents, locationNames } from 'constants/';

type PropsType = {
  reply: MyReplyType;
};

const MyReplyCard = (props: PropsType) => {
  const { reply } = props;
  const { reviewPost, content } = reply;
  const { place, updatedDate } = reviewPost;
  const { LocationStore, ReviewStore } = useStore().MobxStore;

  const handleReplyClick = async () => {
    ReviewStore.initReviewDetail(
      place?.type as RequestType,
      place?.idx as number,
      reviewPost.idx as number
    );
  };

  return (
    <Wrap onClick={handleReplyClick}>
      <PlaceTag>
        {symbolsComponents[
          getImageSymbol(
            LocationStore.categories[place?.name ?? ''].map(
              (category: CategoryType) => category.type
            )
          )
        ] ?? ''}
        {locationNames?.[place?.name ?? ''] ?? place?.name ?? ''}
      </PlaceTag>
      <UpdatedTime>{getTimeDiff(updatedDate ?? '')}</UpdatedTime>
      <Content>{filterBadWords(content)}</Content>
    </Wrap>
  );
};

export default MyReplyCard;

const Wrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${palette.grey[300]}`,
  padding: '20px 24px',
  width: 'calc(100% - 48px)',
  height: 92,
  gap: 8,
});

const PlaceTag = styled('div')({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
  padding: 4,
  marginBottom: 8,
  width: 'fit-content',
  height: 16,
  backgroundColor: 'rgba(96, 92, 255, 0.2)',
  color: palette.violet,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  gap: 2,
  '& svg': {
    width: 16,
    height: 16,
  },
  '& rect': {
    fill: palette.violet,
  },
  '& path': {
    fill: palette.white,
  },
});

const UpdatedTime = styled('span')({
  color: palette.grey[400],
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
});

const Content = styled('span')({
  color: palette.grey[500],
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});
