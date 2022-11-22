import { Box } from '@mui/material';

interface propsType {
  blockHeight?: string;
  blockColor?: string;
}

const Block = (props: propsType) => {
  const { blockHeight = '32px', blockColor = '#d9d9d9' } = props;

  return (
    <Box
      sx={{
        height: blockHeight,
        backgroundColor: blockColor,
      }}
    />
  );
};

export default Block;
