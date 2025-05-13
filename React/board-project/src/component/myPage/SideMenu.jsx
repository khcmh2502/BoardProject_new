import { Link } from 'react-router-dom';
import '../../css/SideMenu.css';

function SideMenu() {
  return (
    <section className="left-side">
      사이드 메뉴
      <ul className="list-group">
        <li>
          <Link to="/myPage/profile">프로필</Link>
        </li>
        <li>
          <Link to="/myPage/info">내 정보</Link>
        </li>
        <li>
          <Link to="/myPage/changePw">비밀번호 변경</Link>
        </li>
        <li>
          <Link to="/myPage/secession">회원 탈퇴</Link>
        </li>
        <li>
          <Link to="/myPage/fileTest">파일 테스트</Link>
        </li>
        <li>
          <Link to="/myPage/fileList">업로드 파일 목록</Link>
        </li>
      </ul>
    </section>
  );
}

export default SideMenu;
