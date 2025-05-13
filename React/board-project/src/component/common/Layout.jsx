import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
// import axiosInstance from '../../api/axiosInstance'; 
import axiosInstance from '../../api/axiosInstance';  // 이렇게 써도 동작함 (axios는 변수명일 뿐)

// npm install axios
const Layout = () => {
  const [boardTypeList, setBoardTypeList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardTypes = async () => {
      try {
        const res = await axiosInstance.get('/board/boardType');
        setBoardTypeList(res.data);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardTypes();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <Header boardTypeList={boardTypeList}/>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
