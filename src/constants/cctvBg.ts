import hongjaechun from 'assets/cctvBg/홍제천.png';
import gangnamdaero from 'assets/cctvBg/강남 강남대로.png';
import seochodaero from 'assets/cctvBg/서초 서초대로.png';
import yeouido from 'assets/cctvBg/영등포 여의도.png';
import seoulgwangjang from 'assets/cctvBg/중구 서울광장.png';
import yangjaechun from 'assets/cctvBg/서초 양재동(양재천).png';

export const cctvBg: Record<string, Record<string, string>> = {
  '월드컵 공원': { 홍제천: hongjaechun },
  강남역: { '강남 강남대로': gangnamdaero, '서초 서초대로': seochodaero },
  여의도역: { '영등포 여의도': yeouido },
  '여의도 한강공원': { '영등포 여의도': yeouido },
  서울광장: { '중구 서울광장': seoulgwangjang },
  양재역: { '서초 양재동(양재천)': yangjaechun },
};
