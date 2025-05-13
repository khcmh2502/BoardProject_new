import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { getCookie, setCookie, deleteCookie } from '../../api/cookieUtil';
import '../../css/Login.css';
import { useUser } from '../common/UserContext';

const Login = () => {
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPw, setMemberPw] = useState('');
  const [saveId, setSaveId] = useState(false);

  const { setLoginMember } = useUser();

  // 페이지 로딩 시 쿠키에서 ID 읽기
  useEffect(() => {
    const savedId = getCookie('saveId');
    if (savedId) {
      setMemberEmail(savedId);
      setMemberPw(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('/member/login', { memberEmail, memberPw });

      // Access Token을 localStorage에 저장
      localStorage.setItem("accessToken", res.data.accessToken);

      // Refresh Token은 서버에서 HttpOnly 쿠키로 내려줬다고 가정
      // 클라이언트에서 접근 불가함
      setLoginMember(res.data.member); // 유저 정보 상태 저장

      // 아이디 저장 체크된 경우 쿠키에 저장
      if (saveId) {
        setCookie('saveId', email, 30); // 30일간 저장
      } else {
        deleteCookie('saveId');
      }

    } catch (err) { // 조회 결과가 없다면 여기가 실행됨 
      // (Axios는 4xx, 5xx를 예외로 처리함)
      // 참고 : fetch API는 -> !response.ok
      alert("알맞은 이메일과 비밀번호를 입력해주세요!");
      console.error(err);
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={memberPw}
            onChange={(e) => setMemberPw(e.target.value)}
            required
          />

          <label>
            <input
              type="checkbox"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
            />
            아이디 저장
          </label>

          <button type="submit">로그인</button>
        </form>

        <article className="signup-find-area">
          <a href="/member/signup">회원가입</a> | <a href="#">ID/PW 찾기</a>
        </article>
      </div>
    </div>
  );
};

export default Login;
