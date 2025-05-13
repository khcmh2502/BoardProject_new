import userImage from '../../assets/user.png';
import Login from '../member/Login';
import { useUser } from './UserContext';

function Home() {
  const { loginMember, setLoginMember, loading } = useUser();

  const handleLogout = async() => {

    try {
      // 클라이언트 토큰 제거
      localStorage.removeItem("accessToken");
      
      setLoginMember(null); // 전역 상태를 null로 변경

    } catch (error) {
      console.error("로그아웃 실패", error);
    }
    
  }
console.log("로딩:", loading, "로그인멤버:", loginMember);
  return (
    <section className="content">
      <main>
        <section className="content">
          <section className="content-1"></section>

          <section className="content-2">
            { loading ? <p>로딩 중...</p>  : !loginMember ?  <Login />
           : (
              <article className="login-area">
                <a href="/myPage/profile">
                  <img
                    src={loginMember.profileImg || userImage}
                    alt="프로필 이미지"
                    id="memberProfile"
                  />
                </a>
                <div className="my-info">
                  <div>
                    <a href="/myPage/info" id="nickname">{loginMember.memberNickname}</a>
                    <button onClick={handleLogout} id="logoutBtn">로그아웃</button>
                  </div>
                  <p>{loginMember.memberEmail}</p>
                </div>
              </article>
            )}
          </section>
        </section>
      </main>
    </section>
  );
}

export default Home;
