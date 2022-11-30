import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 20px',
    marginTop: 15,
  },
  illust: {
    margin: '26px 0',
    width: 84,
    height: 84,
    backgroundColor: '#d9d9d9',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  description: {
    fontSize: 14,
    fontWeight: 500,
    wordBreak: 'keep-all',
  },
}));

const DetailContent = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrap}>
      <div className={classes.illust} />
      <h1 className={classes.title}>현재 더현대는 여유로워요</h1>
      <Button
        sx={{
          borderRadius: 0,
          margin: '16px 0',
          width: '274px',
          backgroundColor: '#d9d9d9',
          color: '#000',
        }}
      >
        CCTV
      </Button>
      <div className={classes.description}>
        사람이 몰려있을 가능성이 낮고 붐빔은 거의 느껴지지 않아요. 도보 이용이 자유로워요.
        특정지역에 인구가 집중되어 있을 수 있어요. 주요 포인트의 혼잡도는 아래에서 확인해주세요
      </div>
    </div>
  );
};

export default DetailContent;
