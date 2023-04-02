import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Drawer, styled } from '@mui/material';
import ProfileHeader from './common/ProfileHeader';
import { useStore } from 'stores';
import { palette } from 'constants/';

type ListsPropsType = {
  title: string;
  lists: string[];
};

const TermsWithLists = (props: ListsPropsType) => {
  const { title, lists } = props;

  return (
    <>
      <Content>{title}</Content>
      <CustomUl>
        {lists.map((list: string) => (
          <CustomList key={`terms-list-${list}`}>{list}</CustomList>
        ))}
      </CustomUl>
    </>
  );
};

const TermsPage = () => {
  const navigate = useNavigate();
  const { ProfileStore } = useStore().MobxStore;

  const handleTermsDrawerClose = useCallback(
    (isPopState?: boolean) => {
      ProfileStore.setTermsPageOpen(false);
      if (isPopState) return;
      navigate(-1);
    },
    [ProfileStore, navigate]
  );

  useEffect(() => {
    if (!ProfileStore.termsPageOpen) return;
    window.onpopstate = () => handleTermsDrawerClose(true);
  }, [handleTermsDrawerClose, ProfileStore.termsPageOpen]);

  return (
    <TermsDrawer
      open={ProfileStore.termsPageOpen}
      onClose={() => handleTermsDrawerClose()}
      anchor='right'
      transitionDuration={{ enter: 250, exit: 0 }}
    >
      <ProfileHeader handleLeftClick={handleTermsDrawerClose} title='서비스 이용약관' />
      <BlankArea />
      <ContentWrap>
        <Title>와글와글 개인정보처리 방침</Title>
        <Content>
          Team EXIT('https://wagglewaggle.co.kr'이하 '와글와글')은 「개인정보 보호법」 제30조에 따라
          정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기
          위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다. 이 개인정보처리방침은2023년 2월
          20일부터 적용됩니다.
        </Content>
        <SubTitle>제1조(개인정보의 처리 목적)</SubTitle>
        <Content>
          Team EXIT(와글와글)은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는
          다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보
          보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
        </Content>
        <Title />
        <Content>
          1. 홈페이지 회원가입 및 관리 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증,
          회원자격 유지·관리, 서비스 부정이용 방지 목적으로 개인정보를 처리합니다.
        </Content>
        <SubTitle>제2조(개인정보의 처리 및 보유 기간)</SubTitle>
        <Content>
          ① Team EXIT은 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에
          동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
        </Content>
        <Title />
        <Content>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</Content>
        <Title />
        <TermsWithLists
          title='1. 홈페이지 회원가입 및 관리 홈페이지 회원가입 및 관리'
          lists={[
            '홈페이지 회원가입 및 관리 홈페이지 회원가입 및 관리와 관련한 개인정보는 수집·이용에 관한 동의일로부터 3년까지 위 이용목적을 위하여 보유·이용됩니다.',
            '1. 보유근거 : 개인정보보호법 제15조',
            '관련법령 : 신용정보의 수집/처리 및 이용 등에 관한 기록 (3년)',
          ]}
        />
        <SubTitle>제3조(처리하는 개인정보의 항목)</SubTitle>
        <Content>Team EXIT은 다음의 개인정보 항목을 처리하고 있습니다.</Content>
        <Title />
        <TermsWithLists
          title='1. 홈페이지 회원가입 및 관리'
          lists={['필수항목 : 이메일, 비밀번호, 로그인ID, 이름']}
        />
        <SubTitle>제4조(개인정보의 파기절차 및 파기방법)</SubTitle>
        <Content>
          ① Team EXIT은 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
          때에는 지체없이 해당 개인정보를 파기합니다.
        </Content>
        <Title />
        <Content>
          ② 정보주체로부터 동의받은 개인정보 보유기간이 경과하거나 처리목적이 달성되었음에도
          불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의
          데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
        </Content>
        <Title />
        <Content>1. 보존하는 개인정보 항목 : 이메일, 비밀번호, 로그인ID, 이름</Content>
        <Title />
        <Content>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.</Content>
        <Title />
        <Content>
          1. 파기절차 Team EXIT은 파기 사유가 발생한 개인정보를 선정하고, Team EXIT의 개인정보
          보호책임자의 승인을 받아 개인정보를 파기합니다.
        </Content>
        <Title />
        <Content>
          2. 파기방법 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
        </Content>
        <SubTitle>제5조(정보주체와 법정대리인의 권리·의무 및 그 행사방법에 관한 사항)</SubTitle>
        <Content>
          ① 정보주체는 Team EXIT에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를
          행사할 수 있습니다.
        </Content>
        <Title />
        <Content>
          ② 제1항에 따른 권리 행사는Team EXIT에 대해 「개인정보 보호법」 시행령 제41조제1항에 따라
          서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 Team EXIT은(는) 이에 대해 지체
          없이 조치하겠습니다.
        </Content>
        <Title />
        <Content>
          ③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여
          하실 수 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에
          따른 위임장을 제출하셔야 합니다.
        </Content>
        <Title />
        <Content>
          ④ 개인정보 열람 및 처리정지 요구는 「개인정보 보호법」 제35조 제4항, 제37조 제2항에 의하여
          정보주체의 권리가 제한 될 수 있습니다.
        </Content>
        <Title />
        <Content>
          ⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는
          경우에는 그 삭제를 요구할 수 없습니다.
        </Content>
        <Title />
        <Content>
          ⑥ Team EXIT은 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람
          등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.
        </Content>
        <SubTitle>제6조(개인정보의 안전성 확보조치에 관한 사항)</SubTitle>
        <Content>
          Team EXIT은 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
        </Content>
        <Title />
        <Content>
          1. 정기적인 자체 감사 실시 개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체
          감사를 실시하고 있습니다.
        </Content>
        <Title />
        <Content>
          2. 개인정보 취급 직원의 최소화 및 교육 개인정보를 취급하는 직원을 지정하고 담당자에
          한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.
        </Content>
        <Title />
        <Content>
          3. 해킹 등에 대비한 기술적 대책 Team EXIT('와글와글')은 해킹이나 컴퓨터 바이러스 등에 의한
          개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며
          외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고
          있습니다.
        </Content>
        <Title />
        <Content>
          4. 개인정보에 대한 접근 제한 개인정보를 처리하는 데이터베이스 시스템에 대한 접근권한의
          부여,변경,말소를 통하여 개인정보에 대한 접근·통제를 위하여 필요한 조치를 하고 있으며
          침입·차단 시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.
        </Content>
        <Title />
        <Content>
          5. 비인가자에 대한 출입 통제 개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에
          대해 출입통제 절차를 수립, 운영하고 있습니다.
        </Content>
        <SubTitle>
          제7조(개인정보를 자동으로 수집하는 장치의 설치·운영 및 그 거부에 관한 사항)
        </SubTitle>
        <Content>
          ① Team EXIT은 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로
          불러오는 ‘쿠키(cookie)’를 사용합니다.
        </Content>
        <Title />
        <Content>
          ② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는
          소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.
        </Content>
        <Title />
        <Content>가. 쿠키의 사용 목적</Content>
        <Content>
          : 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속
          여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
        </Content>
        <Title />
        <Content>나. 쿠키의 설치·운영 및 거부</Content>
        <Content>
          : 웹브라우저 상단의 도구{'>'}인터넷 옵션{'>'}개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을
          거부 할 수 있습니다.
        </Content>
        <Title />
        <Content>
          다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
        </Content>
        <SubTitle>제8조(행태정보의 수집·이용·제공 및 거부 등에 관한 사항)</SubTitle>
        <Content>
          ① 행태정보의 수집·이용·제공 및 거부등에 관한 사항 Team EXIT은 온라인 맞춤형 광고 등을 위한
          행태정보를 수집·이용·제공하지 않습니다.
        </Content>
        <SubTitle>제9조(추가적인 이용·제공 판단기준)</SubTitle>
        <Content>
          Team EXIT은 ｢개인정보 보호법｣ 제15조제3항 및 제17조제4항에 따라 ｢개인정보 보호법 시행령｣
          제13조의2에 따른 사항을 고려하여 정보주체의 동의 없이 개인정보를 추가적으로 이용·제공할 수
          있습니다. 이에 따라 Team EXIT이 정보주체의 동의 없이 추가적인 이용·제공을 하기 위해서
          다음과 같은 사항을 고려하였습니다.
        </Content>
        <Content>
          ▶ 개인정보를 추가적으로 이용·제공하려는 목적이 당초 수집 목적과 관련성이 있는지 여부
        </Content>
        <Content>
          ▶ 개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 추가적인 이용·제공에 대한 예측
          가능성이 있는지 여부
        </Content>
        <Content>
          ▶ 개인정보의 추가적인 이용·제공이 정보주체의 이익을 부당하게 침해하는지 여부
        </Content>
        <Content>▶ 가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부</Content>
        <Title />
        <Content>
          ※ 추가적인 이용·제공 시 고려사항에 대한 판단기준은 사업자/단체 스스로 자율적으로 판단하여
          작성·공개함
        </Content>
        <SubTitle>제10조(가명정보를 처리하는 경우 가명정보 처리에 관한 사항)</SubTitle>
        <Content>Team EXIT은 다음과 같은 목적으로 가명정보를 처리하고 있습니다.</Content>
        <TermsWithLists
          title='▶ 가명정보의 처리 목적'
          lists={[
            'Team EXIT의 서비스 사용자들의 실명을 보호하기 위해 가명 정보(닉네임)을 사용하고 있습니다.',
          ]}
        />
        <TermsWithLists
          title='▶ 가명정보의 처리 및 보유기간'
          lists={['가명정보는 회원 탈퇴 시 즉시 삭제됩니다.']}
        />
        <TermsWithLists
          title='▶ 법 제28조의4(가명정보에 대한 안전조치 의무 등)에 따른 가명정보의 안전성 확보조치에 관한 사항'
          lists={['가명정보를 활용하여 실명 정보를 보호하고 있습니다.']}
        />
        <SubTitle>제11조(개인정보 보호책임자에 관한 사항)</SubTitle>
        <Content>
          ① Team EXIT은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
          정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
          있습니다.
        </Content>
        <TermsWithLists
          title='▶ 개인정보 보호책임자'
          lists={['성명 : 김경식', '직책 : 개발자', '연락처 : 01020390759, kskim625@gmail.com']}
        />
        <Title />
        <Content>
          ② 정보주체께서는 Team EXIT의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호
          관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실
          수 있습니다. Team EXIT은 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
        </Content>
        <SubTitle>제12조(개인정보의 열람청구를 접수·처리하는 부서)</SubTitle>
        <Content>
          정보주체는 ｢개인정보 보호법｣ 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수
          있습니다. Team EXIT은 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.
        </Content>
        <TermsWithLists
          title='▶ 개인정보 열람청구 접수·처리 부서'
          lists={['담당자 : 김경식', '연락처 : 01020390759, kskim625@gmail.com']}
        />
        <SubTitle>제13조(정보주체의 권익침해에 대한 구제방법)</SubTitle>
        <Content>
          정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원
          개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타
          개인정보침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
        </Content>
        <Title />
        <Content>1. 개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</Content>
        <Title />
        <Content>2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</Content>
        <Title />
        <Content>3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)</Content>
        <Title />
        <Content>
          4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)「개인정보보호법」제35조(개인정보의 열람),
          제36조(개인정보의 정정·삭제), 제37조(개인정보의 처리정지 등)의 규정에 의한 요구에 대 하여
          공공기관의 장이 행한 처분 또는 부작위로 인하여 권리 또는 이익의 침해를 받은 자는
          행정심판법이 정하는 바에 따라 행정심판을 청구할 수 있습니다.
        </Content>
        <Title />
        <Content>
          ※ 행정심판에 대해 자세한 사항은 중앙행정심판위원회(www.simpan.go.kr) 홈페이지를 참고하시기
          바랍니다.
        </Content>
        <SubTitle>제14조(개인정보 처리방침 변경)</SubTitle>
        <Content>이 개인정보처리방침은 2023년 2월 20부터 적용됩니다.</Content>
      </ContentWrap>
    </TermsDrawer>
  );
};

export default observer(TermsPage);

const TermsDrawer = styled(Drawer)({
  '& .MuiPaper-root': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 430,
  },
});

const ContentWrap = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '40px 24px',
  width: 'calc(100% - 48px)',
  borderTop: `1px solid ${palette.grey[300]}`,
  color: palette.black,
  '& p:last-of-type': {
    marginBottom: 44,
  },
});

const Title = styled('p')({
  margin: '0 0 24px 0',
  fontSize: 18,
  fontWeight: 600,
  lineHeight: '24px',
});

const SubTitle = styled('p')({
  margin: '24px 0 8px 0',
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
});

const Content = styled('p')({
  margin: 0,
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});

const CustomUl = styled('ul')({
  margin: 0,
  paddingLeft: 22.5,
});

const CustomList = styled('li')({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
});

const BlankArea = styled('div')({
  width: '100%',
  height: 52,
  minHeight: 52,
});
