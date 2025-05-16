import Layout from './component/common/Layout';
import Home from './component/common/Home';
import { Route, Routes } from 'react-router-dom';
import SignUp from './component/member/SignUp';
import MyPageInfo from './component/myPage/MyPageInfo';
import ProtectedRoute from './component/common/ProtectedRoute';
import MyPageProfile from './component/myPage/MyPageProfile';
import ChangePassword from './component/myPage/ChangePassword';
import Secession from './component/myPage/Secession';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* 회원가입 페이지 */}
        <Route path="/member/signup" element={<SignUp />} />

        {/* myPage 라우터가드 그룹화 */}
        <Route path="myPage">
          {/* /myPage의 profile */}
          <Route path="profile"
            element={
              <ProtectedRoute>
                <MyPageProfile />
              </ProtectedRoute>
            }
          />
          {/* /myPage의 info */}
          <Route path="info"
            element={
              <ProtectedRoute>
                <MyPageInfo />
              </ProtectedRoute>
            }
          />
          {/* /myPage의 changePw */}
          <Route path='changePw' element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
          {/* /myPage의 secession */}
          <Route path='secession' element={
            <ProtectedRoute>
              <Secession />
            </ProtectedRoute>
          } />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
