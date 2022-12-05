import { Dialog, DialogContent } from '@mui/material';

interface propsType {
  open: boolean;
  handleCloseDialog: () => void;
}

const CctvDialog = (props: propsType) => {
  const { open, handleCloseDialog } = props;

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogContent sx={{ padding: '2px' }}>
        <iframe
          title='CCTV Dialog'
          src='https://data.seoul.go.kr/SeoulRtd/cctv?src=http://210.179.218.51:1935/live/71.stream/playlist.m3u8&cctvname=L010069'
          width={320}
          height={240}
          frameBorder={0}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CctvDialog;
