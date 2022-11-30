import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 20px 24px',
  },
  divider: {
    margin: '24px 0',
    width: '100%',
    backgroundColor: '#000',
    opacity: 0.1,
  },
  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
  },
  description: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: 500,
    wordBreak: 'keep-all',
  },
}));

const DetailPrediction = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrap}>
      <hr className={classes.divider} />
      <h3 className={classes.title}>향후 12시간 전망</h3>
      <div className={classes.description}>
        00시 후 인구가 제일 많고 혼잡도도 가장 높을 것으로 예상돼요. 혼잡정도는 매우 높음일 것으로
        예상돼요.
      </div>
    </div>
  );
};

export default DetailPrediction;
