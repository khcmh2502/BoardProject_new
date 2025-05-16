import { useEffect, useRef, useState } from 'react';
import '../../css/SignUp.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const SignUp = () => {
  const navigate = useNavigate();

  // 서버에 제출할 데이터 상태값
  const [form, setForm] = useState({
    memberEmail: '',
    authKey: '',
    memberPw: '',
    memberPwConfirm: '',
    memberNickname: '',
    memberTel: '',
    memberAddress: ''
  });

  // 유효성 검사 객체
  // 필수 입력 항목의 유효성 검사 여부를 체크하기 위한 객체
  // - true  == 해당 항목은 유효한 형식으로 작성됨
  // - false == 해당 항목은 유효하지 않은 형식으로 작성됨
  const [checkObj, setCheckObj] = useState({
    memberEmail: false,
    authKey: false,
    memberPw: false,
    memberPwConfirm: false,
    memberNickname: false,
    memberTel: false
  });

  const [postcode, setPostcode] = useState(''); // 우편번호
  const [address, setAddress] = useState('');   // 도로명/지번주소
  const [detailAddress, setDetailAddress] = useState(''); // 상세주소

  const [emailMessage, setEmailMessage] = useState('');     // 이메일 관련 메시지
  const [authKeyMessage, setAuthKeyMessage] = useState(''); // 인증번호 관련 메시지
  const [pwMessage, setPwMessage] = useState("영어,숫자,특수문자(!,@,#,-,_) 6~20글자 사이로 입력해주세요.");  // 비밀번호 관련 메시지
  const [nickMessage, setNickMessage] = useState('한글,영어,숫자로만 2~10글자');    // 닉네임 관련 메시지
  const [telMessage, setTelMessage] = useState('');         // 전화번호 관련 메시지

  const [authSent, setAuthSent] = useState(false); // 인증번호 발송여부
  const [authTimeLeft, setAuthTimeLeft] = useState(300); // 남은 시간 (5분)
  const [isLoading, setIsLoading] = useState(false); // 이메일 인증 로딩

  const timerRef = useRef(null); // 타이머 ID 저장용

  // 유효성 검사 함수들
  const validateEmail = email =>
    /^[\w\.-]+@[\w\.-]+\.\w+$/.test(email);

  const validatePassword = pw =>
    /^[\w!@#_-]{6,20}$/.test(pw);

  const validateNickname = nick =>
    /^[가-힣\w]{2,10}$/.test(nick);

  const validateTel = tel =>
    /^010\d{8}$/.test(tel);

  // 타이머 useEffect
  useEffect(() => {
    // 인증번호 발송이 되지 않았을 때 리턴
    if (!authSent) return;

    // 타이머가 만료되었을 때 
    if (authTimeLeft === 0) {
      clearInterval(timerRef.current); // 인터벌 함수 없앰
      timerRef.current = null;
      return;
    }

    const timer = setInterval(() => {
      setAuthTimeLeft((prev) => prev - 1);
    }, 1000);

    timerRef.current = timer;

    return () => clearInterval(timer);
  }, [authTimeLeft, authSent]);

  // 모든 input의 값변화 처리함수
  const handleChange = (e) => {
    const { name, value } = e.target;

    // form 의 각 name과 value값 세팅
    setForm(prev => ({ ...prev, [name]: value }));

    // 이메일 작성 시
    if (name == "memberEmail") {
      // 중복 이메일 검사 함수 호출
      checkEmailDuplicate(value);
    }

    // 비밀번호 작성 시
    if (name == "memberPw") {
      checkMemberPw(value);
    }

    // 비밀번호 확인 작성 시
    if (name == "memberPwConfirm") {
      checkMemberPwConfirm(value);
    }

    // 닉네임 작성 시
    if (name == "memberNickname") {
      checkMemberNickname(value);
    }

    // 전화번호 작성 시
    if (name == "memberTel") {
      checkMemberTel(value);
    }
  };

  /* ***********이메일*********** */

  // 이메일 중복검사
  const checkEmailDuplicate = async (email) => {

    console.log("재작성");

    // 1. 이메일 인증 후 이메일이 변경된 경우
    setCheckObj(prev => ({ ...prev, authKey: false }));
    setAuthKeyMessage('');

    // 타이머 중단
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 2. 입력된 이메일이 없을 경우
    if (email.trim().length === 0) {
      setEmailMessage('');
      setCheckObj(prev => ({ ...prev, memberEmail: false }));
      return;
    }

    // 3.  입력된 이메일이 있을 경우 정규식 검사
    //    (알맞은 형태로 작성했는지 검사)
    if (!validateEmail(email)) {
      // 영어, 숫자, 특수문자(. _ % + -)를 허용
      // 이메일 형식으로 작성
      // 도메인 부분은 최소 2개의 문자로 끝나야함 (.com, .net, .org, .kr 등) 
      setEmailMessage('유효한 이메일을 입력해주세요.');
      setCheckObj(prev => ({ ...prev, memberEmail: false }));
      return;
    }

    // 4. 유효한 이메일 형식인 경우 중복 검사 수행 이메일 중복 검사 수행
    const response = await axiosInstance.post('/member/checkEmail', { email });
    const { isDuplicate, message } = response.data;

    // 메세지 세팅
    setEmailMessage(message);

    // isDuplicate 가 true -> 중복 아님(사용가능)
    // isDuplicate 가 false -> 중복임(사용불가능)
    // 상태변경
    setCheckObj(prev => ({ ...prev, memberEmail: isDuplicate }));

  }

  // 이메일 인증번호 전송 함수
  const handleSendAuth = async () => {
    // 새로운 인증번호 발급을 원하는것이기 때문에 
    // 새로 발급받은 인증번호 확인전까진 checkObj.authKey는 false
    setCheckObj(prev => ({ ...prev, authKey: false }));
    setForm(prev => ({ ...prev, authKey: '' })); // 인증번호 재발급 받으면 인증번호 입력 input 비우기 
    setAuthKeyMessage(""); // 인증번호 발급 관련 메세지 비우기

    // 중복되지 않은 유효한 이메일을 입력한 경우가 아니면
    if (!checkObj.memberEmail) {
      alert("유효한 이메일 작성 후 클릭해 주세요");
      return;
    }

    try {
      setIsLoading(true); // 로딩 시작

      // 인증번호 이메일 전송 요청
      await axiosInstance.post('/email/sendAuth', { email: form.memberEmail });

      alert('인증번호가 전송되었습니다.');
      setAuthTimeLeft(300);  // 5분 설정
      setAuthSent(true); // 이메일 전송 여부 true

    } catch (err) {
      alert('이메일 전송 실패');

    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 인증번호 확인 버튼을 눌렀을 때 실행되는 비동기 함수
  const handleCheckAuthKey = async () => {
    // 입력된 인증번호를 비동기로 서버에 전달
    // -> 입력된 인증번호와 발급된 인증번호가 같은지 비교
    //   같으면 1, 아니면 0반환
    // 단, 타이머가 00:00초가 아닐 경우에만 수행

    // 1) 시간이 만료된 경우
    if (authTimeLeft <= 0) {
      alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
      return;
    }

    // 2) autyKey가 제대로 입력되지 않은 경우
    if (form.authKey.length < 6) {
      alert("인증번호를 정확히 입력해 주세요.");
      return;
    }

    // 3) 문제 없는 경우(제한시간, 인증번호 길이 유효 시)
    try {
      const res = await axiosInstance.post('/email/checkAuthKey', {
        email: form.memberEmail,
        authKey: form.authKey
      });


      if (res.data.success) { // 인증 성공 시
        setAuthKeyMessage('인증에 성공했습니다.'); // 메시지 세팅
        setAuthTimeLeft(0); // 타이머 초기화
        setCheckObj(prev => ({ ...prev, authKey: true })); // checkObj의 authKey를 true로

      } else {
        alert("인증번호가 일치하지 않습니다.");
        // 타이머는 계속 흐름
        setCheckObj(prev => ({ ...prev, authKey: false })); // checkObj의 authKey를 false로
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      setAuthTimeLeft(0); // 타이머 초기화
      setCheckObj(prev => ({ ...prev, authKey: false })); // checkObj의 authKey를 false로
    }
  };

  // 화면에서 메시지를 보여주기 위한 함수 (return에서 span에 넣을 내용)
  const renderAuthKeyMessage = () => {
    if (authKeyMessage) return authKeyMessage;

    // 이메일보냈고, 아직 인증번호 인증이 완료되지 않았고, 시간이 남았을 때
    if (authSent && !checkObj.authKey && authTimeLeft > 0) {
      const minutes = Math.floor(authTimeLeft / 60);
      const seconds = authTimeLeft % 60;
      return `남은 시간 ${minutes} : ${seconds < 10 ? '0' + seconds : seconds}`;
    }

    return '';
  };

  /* ***********비밀번호*********** */
  // 비밀번호, 비밀번호확인이 같은지 검사하는 함수
  const checkPw = (pw, pwConfirm) => {

    // 같을 경우
    if (pw === pwConfirm) {
      setPwMessage("비밀번호가 일치합니다");
      setCheckObj(prev => ({ ...prev, memberPwConfirm: true })); // checkObj의 memberPwConfirm를 true로
      return;
    }

    setPwMessage("비밀번호가 일치하지 않습니다");
    setCheckObj(prev => ({ ...prev, memberPwConfirm: false })); // checkObj의 memberPwConfirm를 false로

  };

  // 비밀번호 유효성 검사 함수
  const checkMemberPw = (pw) => {
    if (pw.trim().length === 0) { // 입력되지 않은 경우
      setPwMessage("영어,숫자,특수문자(!,@,#,-,_) 6~20글자 사이로 입력해주세요.");
      setCheckObj(prev => ({ ...prev, memberPw: false })); // checkObj의 memberPw를 false로
      setForm(prev => ({ ...prev, memberPw: '' })); // 처음에 띄어쓰기 입력 못하게 하기
      return;
    }

    // 정규식에서 통과하지 못했을 때
    if (!validatePassword(pw)) {
      setPwMessage("비밀번호가 유효하지 않습니다");
      setCheckObj(prev => ({ ...prev, memberPw: false })); // checkObj의 memberPw를 false로
      return;
    }

    // 유효한 경우
    setPwMessage("유효한 비밀번호 형식입니다");
    setCheckObj(prev => ({ ...prev, memberPw: true })); // checkObj의 memberPw를 true로

    // 비밀번호 확인에 값이 작성되어 있을 때
    // 비밀번호 , 비밀번호 확인 검사 함수 호출
    if (form.memberPwConfirm.length > 0) {
      checkPw(pw, form.memberPwConfirm);
    }
  }

  // 비밀번호 확인 유효성 검사 함수
  // 단, 비밀번호(memberPw)가 유효할 때만 검사 수행
  const checkMemberPwConfirm = (pwConfirm) => {

    console.log(checkObj.memberPw);
    if (checkObj.memberPw) { // memberPw가 유효한 경우
      checkPw(form.memberPw, pwConfirm); // 비교하는 함수 수행
      return;
    }
    // memberPw가 유효하지 않은 경우
    // memberPwConfirm 검사 X
    setCheckObj(prev => ({ ...prev, memberPwConfirm: false }));
  }

  /* ***********닉네임*********** */
  // 닉네임 유효성검사
  const checkMemberNickname = async (nickname) => {
    // 1) 입력 안한 경우
    if (nickname.trim().length === 0) {
      setNickMessage("한글,영어,숫자로만 2~10글자");
      setCheckObj(prev => ({ ...prev, memberNickname: false })); // checkObj의 memberNickname를 false로
      setForm(prev => ({ ...prev, memberNickname: '' })); // 처음에 띄어쓰기 입력 못하게 하기
      return;
    }

    // 2) 정규식에서 통과하지 못했을 때
    if (!validateNickname(nickname)) {
      setNickMessage("유효하지 않은 닉네임 형식입니다.");
      setCheckObj(prev => ({ ...prev, memberNickname: false })); // checkObj의 memberNickname를 false로
      return;
    }

    // 3) 중복 검사 (유효한 경우)
    const resp = await axiosInstance.post('/member/checkNickname', { nickname });
    const { isDuplicate, message } = resp.data;
    console.log(resp.data);

    // 메세지 세팅
    setNickMessage(message);

    // isDuplicate 가 true -> 중복 아님(사용가능)
    // isDuplicate 가 false -> 중복임(사용불가능)
    // 상태변경
    setCheckObj(prev => ({ ...prev, memberNickname: isDuplicate }));
  }

  /* ***********전화번호*********** */
  const checkMemberTel = (tel) => {
    // 1) 입력 안한 경우
    if (tel.trim().length === 0) {
      setTelMessage("전화번호를 입력해주세요.(- 제외)");
      setCheckObj(prev => ({ ...prev, memberTel: false })); // checkObj의 memberTel을 false로
      setForm(prev => ({ ...prev, memberTel: '' })); // 처음에 띄어쓰기 입력 못하게 하기
      return;
    }

    // 2) 정규식에서 통과하지 못했을 때
    if (!validateTel(tel)) {
      setTelMessage("유효하지 않은 전화번호 형식입니다.");
      setCheckObj(prev => ({ ...prev, memberTel: false })); // checkObj의 memberTel을 false로
      return;
    }

    setTelMessage("유효한 전화번호 형식입니다.");
    setCheckObj(prev => ({ ...prev, memberTel: true })); // checkObj의 memberTel을 false로

  }

  /* ***********주소*********** */
  // 주소 검색 핸들러
  const handleSearchAddress = () => {
    // 다음 주소 API 사용
    new window.daum.Postcode({
      oncomplete: function (data) {
        const { zonecode, roadAddress } = data;
        setPostcode(zonecode);
        setAddress(roadAddress);
        setDetailAddress('');
      },
    }).open();
  };

  // 최종 회원가입 처리
  const handleSubmit = async e => {
    e.preventDefault(); // 기본적 제출 이벤트 막음

    // checkObj의 저장된 값(value) 중
    // 하나라도 false가 있으면 제출 X

    // for ~ in (객체 전용 향상된 for 문)
    for (let key in checkObj) { // checkObj 요소의 key 값을 순서대로 꺼내옴
      if (!checkObj[key]) { // 현재 접근중인 checkObj[key]의 value 값이 false 인 경우 (유효하지 않음)
        let str; // 출력할 메시지를 저장할 변수

        switch (key) {
          case "memberEmail": str = "이메일이 유효하지 않습니다"; break;
          case "authKey": str = "이메일이 인증되지 않았습니다"; break;
          case "memberPw": str = "비밀번호가 유효하지 않습니다"; break;
          case "memberPwConfirm": str = "비밀번호가 일치하지 않습니다"; break;
          case "memberNickname": str = "닉네임이 유효하지 않습니다"; break;
          case "memberTel": str = "전화번호가 유효하지 않습니다"; break;
        }

        alert(str);
        return;
      }
    }

    // 상세주소가 입력되었으나 우편번호, 도로명/지번이 없다면
    if (detailAddress.length > 0 && address.length == 0 && postcode.length == 0) {
      alert("주소를 정확하게 입력해주세요");
      return;
    }

    // 3. 전송용 객체 준비
    const submitForm = { ...form }; // form 상태 복사(얕은 복사)
    // ...form : 스프레드 문법 (spread syntax) - 객체의 1단계 속성들만 복사
    // { ...form } : form의 속성들을 복사하여 새로운 객체 생성
    // (submitForm은 상태값을 복사한 단순 js 변수임(상태 X))

    // 주소 필드 모두 입력이 다 되었다면
    if (postcode.length > 0 && address.length > 0 && detailAddress.length > 0) {
      submitForm.memberAddress = [postcode, address, detailAddress].join('^^^');
      // -> "12345^^^서울특별시 강남구^^^101호"
    }

    /*
    if(postcode.length > 0 && address.length > 0 && detailAddress.length > 0) {
      const fullAddress = [postcode, address, detailAddress].join('^^^');
      // -> "12345^^^서울특별시 강남구^^^101호"
      setForm(prev => ({...prev, memberAddress : fullAddress}));
    } -> 해당 코드는 setState도 비동기, 아래 axios도 비동기라 주소의 상태값이 반영되기 전임
    */

    try {
      const res = await axiosInstance.post('/member/signup', submitForm);

      if (res.status == 200) {
        alert(`${submitForm.memberNickname}님의 가입이 완료되었습니다.`);
      }

      // navigate()을 통한 페이지 전환 시 브라우저가 자동으로 스크롤 맨위로 올려주지 않음 (이동한 페이지에서 스크롤이 내려와있을 수 있음)
      navigate("/");
      window.scrollTo(0, 0);

    } catch (err) {
      console.log(err);
      alert('회원가입 실패');
    }
  };

  return (
    <main>
      <section className="signUp-content">
        <form onSubmit={handleSubmit}>

          {/* 이메일 입력 */}
          <label htmlFor="memberEmail">
            <span className="required">*</span> 아이디(이메일)
          </label>

          <div className="signUp-input-area">
            <input
              type="text"
              name="memberEmail"
              value={form.memberEmail}
              onChange={handleChange}
              placeholder="아이디(이메일)"
              className={checkObj.memberEmail ? "confirm" : ''}
            />
            <button
              id="sendAuthKeyBtn"
              type="button"
              onClick={handleSendAuth}
              disabled={isLoading}
              className={isLoading ? 'disable-btn' : ''}
            >
              {isLoading ? '전송 중...' : '인증번호 받기'}
            </button>
          </div>
          <span className="signUp-message">
            {emailMessage}
          </span>

          {/* 인증번호 입력 */}
          <label>
            <span className="required">*</span> 인증번호
          </label>

          <div className="signUp-input-area">
            <input
              type="text"
              name="authKey"
              value={form.authKey}
              onChange={handleChange}
              placeholder="인증번호"
              className={checkObj.authKey ? "confirm" : ''}
            />
            <button
              id="checkAuthKeyBtn"
              type="button"
              onClick={handleCheckAuthKey}
              disabled={checkObj.authKey}
              className={checkObj.authKey ? 'disable-btn' : ''}
            >
              인증하기
            </button>
          </div>

          <span className="signUp-message">
            {renderAuthKeyMessage()}
          </span>

          {/* 비밀번호 입력 */}
          <label>
            <span className="required">*</span> 비밀번호
          </label>
          <div className="signUp-input-area">
            <input
              type="password"
              name="memberPw"
              value={form.memberPw}
              onChange={handleChange}
              placeholder="비밀번호"
              className={checkObj.memberPw ? "confirm" : ''}
            />
          </div>
          <div className="signUp-input-area">
            <input
              type="password"
              name="memberPwConfirm"
              value={form.memberPwConfirm}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              className={checkObj.memberPwConfirm ? "confirm" : ''}
            />
          </div>
          <span className="signUp-message">{pwMessage}</span>

          {/* 닉네임 */}
          <label>
            <span className="required">*</span> 닉네임
          </label>
          <div className="signUp-input-area">
            <input
              type="text"
              name="memberNickname"
              value={form.memberNickname}
              onChange={handleChange}
              placeholder="닉네임"
              className={checkObj.memberNickname ? "confirm" : ''}
            />
          </div>
          <span className="signUp-message">{nickMessage}</span>

          {/* 전화번호 */}
          <label>
            <span className="required">*</span> 전화번호
          </label>
          <div className="signUp-input-area">
            <input
              type="text"
              name="memberTel"
              value={form.memberTel}
              onChange={handleChange}
              placeholder="- 제외"
              className={checkObj.memberTel ? "confirm" : ''}
            />
          </div>
          <span className="signUp-message">{telMessage}</span>

          {/* 주소 */}
          <label htmlFor="memberAddress">주소</label>

          <div className="signUp-input-area">
            <input
              type="text"
              name="postcode"
              placeholder="우편번호"
              id="postcode"
              value={postcode}
              readOnly
            />
            <button type="button" onClick={handleSearchAddress}>
              검색
            </button>
          </div>

          <div className="signUp-input-area">
            <input
              type="text"
              name="address"
              placeholder="도로명/지번 주소"
              id="address"
              value={address}
              readOnly
            />
          </div>

          <div className="signUp-input-area">
            <input
              type="text"
              name="detailAddress"
              placeholder="상세 주소"
              id="detailAddress"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </div>

          <button id="signUpBtn" type="submit">가입하기</button>
        </form>
      </section>
    </main>
  );
};

export default SignUp;
