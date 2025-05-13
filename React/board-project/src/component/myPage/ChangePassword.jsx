import { useState } from "react";
import SideMenu from "./SideMenu";
import '../../css/MyPageInfo.css';

function ChangePassword() {
  const [form, setForm] = useState({
    currentPw: "",
    newPw: "",
    newPwConfirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 비밀번호 변경 API 호출 로직 추가
    console.log("변경 요청:", form);
  };

  return (

    <main>
      <section className="myPage-content">
        <SideMenu />

        <section className="myPage-main">
          <h1 className="myPage-title">비밀번호 변경</h1>
          <span className="myPage-subject">
            현재 비밀번호가 일치하는 경우 새 비밀번호로 변경할 수 있습니다.
          </span>

          <form onSubmit={handleSubmit} id="changePw" name="myPageFrm">
            <div className="myPage-row">
              <label htmlFor="currentPw">현재 비밀번호</label>
              <input
                type="password"
                name="currentPw"
                id="currentPw"
                maxLength="30"
                value={form.currentPw}
                onChange={handleChange}
              />
            </div>

            <div className="myPage-row">
              <label htmlFor="newPw">새 비밀번호</label>
              <input
                type="password"
                name="newPw"
                id="newPw"
                maxLength="30"
                value={form.newPw}
                onChange={handleChange}
              />
            </div>

            <div className="myPage-row">
              <label htmlFor="newPwConfirm">새 비밀번호 확인</label>
              <input
                type="password"
                name="newPwConfirm"
                id="newPwConfirm"
                maxLength="30"
                value={form.newPwConfirm}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="myPage-submit">
              변경하기
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default ChangePassword;
