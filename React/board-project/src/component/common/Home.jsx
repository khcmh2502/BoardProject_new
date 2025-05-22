import userImage from "../../assets/user.png";
import Login from "../member/Login";
import { useUser } from "./UserContext";
import { useEffect } from "react";

function Home() {
  const { loginMember, setLoginMember, loading } = useUser();

  // 메인페이지 렌더링 시 accessToken이 없다면 전역 상태값 loginMember null로 변경
  // -> axiosInstance에서는 Context불러올 수 없음
  useEffect(() => {
    if (localStorage.getItem("accessToken") == null) {
      setLoginMember(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // 클라이언트 토큰 제거
      localStorage.removeItem("accessToken");

      setLoginMember(null); // 전역 상태를 null로 변경
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <section className="content">
      <section className="content-1">
        <div>
          <h1>최근 게시글</h1>
        </div>
        <div>
          <h1>인기 게시글</h1>
        </div>
      </section>

      <section className="content-2">
        {loading ? (
          <p>로딩 중...</p>
        ) : !loginMember ? (
          <Login />
        ) : (
          <article className="login-area">
            <a href="/myPage/profile">
              <img
                src={`http://localhost${loginMember.profileImg}` || userImage}
                alt="프로필 이미지"
                id="memberProfile"
              />
            </a>
            <div className="my-info">
              <div>
                <a href="/myPage/info" id="nickname">
                  {loginMember.memberNickname}
                </a>
                <button onClick={handleLogout} id="logoutBtn">
                  로그아웃
                </button>
              </div>
              <p>{loginMember.memberEmail}</p>
            </div>
          </article>
        )}
      </section>
    </section>
  );
}

export default Home;
