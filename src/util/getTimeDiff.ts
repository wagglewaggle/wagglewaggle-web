const getTimeDiff = (createdDate: string) => {
  const newTimePassed: number = Math.round(
    (new Date().getTime() - new Date(createdDate || '').getTime()) / 60000
  );
  return newTimePassed >= 525600
    ? `${Math.floor(newTimePassed / 525600)}년 전`
    : newTimePassed >= 43200
    ? `${Math.floor(newTimePassed / 43200)}달 전`
    : newTimePassed >= 1440
    ? `${Math.floor(newTimePassed / 1440)}일 전`
    : newTimePassed >= 60
    ? `${Math.floor(newTimePassed / 60)}시간 전`
    : newTimePassed >= 1
    ? `${newTimePassed}분 전`
    : '방금 전';
};

export default getTimeDiff;
