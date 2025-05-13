import { useState } from "react";
import SideMenu from "./SideMenu";
import '../../css/MyPageInfo.css';

function Secession() {
  const [form, setForm] = useState({
    memberPw: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) {
      alert("약관에 동의하셔야 탈퇴가 가능합니다.");
      return;
    }
    // TODO: 회원 탈퇴 API 요청
    console.log("탈퇴 요청:", form);
  };

  return (
    <main>
      <section className="myPage-content">
        <SideMenu />

        <section className="myPage-main">
          <h1 className="myPage-title">회원 탈퇴</h1>
          <span className="myPage-subject">
            현재 비밀번호가 일치하는 경우 탈퇴할 수 있습니다.
          </span>

          <form onSubmit={handleSubmit} name="myPageFrm" id="secession">
            <div className="myPage-row">
              <label htmlFor="memberPw">비밀번호</label>
              <input
                type="password"
                name="memberPw"
                id="memberPw"
                maxLength="30"
                value={form.memberPw}
                onChange={handleChange}
              />
            </div>

            <div className="myPage-row info-title">
              <label>회원 탈퇴 약관</label>
            </div>

            <pre className="secession-terms">
              {/* {``} 안에 내용을 넣어줘야 pre태그 역할을 함 */}
              {`제1조
이 약관은 샘플 약관입니다.

① 약관 내용 1

② 약관 내용 2

③ 약관 내용 3

④ 약관 내용 4

제2조
이 약관은 샘플 약관입니다.

① 약관 내용 1

② 약관 내용 2

③ 약관 내용 3

④ 약관 내용 4`}
            </pre>

            <div>
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree">위 약관에 동의합니다.</label>
            </div>

            <button type="submit" className="myPage-submit">
              탈퇴
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default Secession;
