import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost", // 모든 요청 앞에 자동으로 붙음
  withCredentials: true, // 쿠키 포함 (필요 시)
});

// const { loginMember, setLoginMember, loading } = useUser();
// error! Hooks 사용 규칙을 위반(Hook이 함수 컴포넌트나 커스텀 Hook이 아닌 곳에서 호출됨)

//인터셉터 설정(응답이 오면 먼저 가로채기함)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 응답이 에러상태이고, 에러 상태번호가 401이라면(SC_UNAUTHORIZED)
    if (error.response && error.response.status === 401) {
      // 클라이언트 토큰 제거
      localStorage.removeItem("accessToken");
      // 이곳에서 상태값 loginMember null변경 불가능

      // 토큰 유효성 실패, 로그인 페이지로 이동
      window.location.href = "/"; // 메인페이지로 이동(해당 컴포넌트에서 loginMember null변경 필요)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
