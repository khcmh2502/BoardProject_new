// UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [loginMember, setLoginMember] = useState(null); // 로그인 정보 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const fetchUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false); // 비로그인도 로딩 완료
      return;
    }

    try {
      // OPTIONS 요청 : 브라우저가 서버에 먼저 보내는 사전 요청(preflight request)
      // React에서 서버로 Authorization 헤더를 포함한 GET, POST 같은 요청을 보낼 때 브라우저는 보안상 먼저 이렇게 물어봄
      // -> 서버야! 내가 이 요청 보낼 건데, 이런 헤더랑 메서드 써도 괜찮아? 라고 클라이언트가 
      // 다음 조건 중 하나라도 해당되면 브라우저는 OPTIONS 요청을 먼저 보냄
      // 1. Authorization, Content-Type, X-Requested-With 같은 커스텀 헤더 사용
      // 2. PUT, DELETE, PATCH 같은 특수 메서드 사용
      // 3. application/json 같은 특정 Content-Type 사용

      const res = await axiosInstance.get('/myPage/memberInfo', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(res.data);
      setLoginMember(res.data.member);

    } catch (err) {
      console.error('유저 정보 가져오기 실패:', err);
      setLoginMember(null);

    } finally {
      setLoading(false); // 무조건 로딩 끝
    }
  };

  useEffect(() => {
    fetchUser(); // 앱 시작 시 로그인 정보 확인
  }, []);

  return (
    <UserContext.Provider value={{ loginMember, setLoginMember, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
