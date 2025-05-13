// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';


function ProtectedRoute({ children }) {
  const { loginMember, loading } = useUser();

  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 로그인하지 않았으면 메인 페이지로 이동
  if (!loginMember) {
    alert("로그인 후 이용바랍니다!");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
