import { useEffect, useState } from 'react';
import '../../css/MyPageInfo.css';
import { useUser } from "../common/UserContext";
import SideMenu from "./SideMenu";

function MyPageInfo() {
  const { loginMember, setLoginMember } = useUser();
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    if (loginMember?.memberAddress) {
      const [code = '', addr = '', detail = ''] = loginMember.memberAddress.split('^^^');
      setPostcode(code);
      setAddress(addr);
      setDetailAddress(detail);
    }
  }, [loginMember]);
  // loginMember가 로딩된 후 동작하도록 loginMember를 의존성추가


  // 주소 검색 핸들러
  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const { zonecode, roadAddress } = data;
        setPostcode(zonecode);
        setAddress(roadAddress);
        // setLoginMember((prev) => ({
        //   ...prev,
        //   postcode: zonecode,
        //   address: roadAddress,
        // }));
        setDetailAddress('');
      },
    }).open();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main>
      <section className="myPage-content" style={{ display: "flex" }}>
        <SideMenu />

        <section className="myPage-main" style={{ flex: 1, paddingLeft: "20px" }}>
          <h1 className="myPage-title">내 정보</h1>
          <span className="myPage-subject">원하는 회원 정보를 수정할 수 있습니다.</span>

          <form
            action="/myPage/info"
            method="POST"
            name="myPageFrm"
            id="updateInfo"
          >
            <div className="myPage-row">
              <label>닉네임</label>
              <input
                type="text"
                name="memberNickname"
                maxLength="10"
                value={loginMember.memberNickname}
                onChange={handleChange}
              />
              <input type="hidden" id="currentNickname" value={loginMember.memberNickname} />
            </div>

            <div className="myPage-row">
              <label>전화번호</label>
              <input
                type="text"
                name="memberTel"
                maxLength="11"
                value={loginMember.memberTel}
                onChange={handleChange}
              />
            </div>

            <div className="myPage-row info-title">
              <span>주소</span>
            </div>

            <div className="myPage-row info-address">
              <input
                type="text"
                name="postcode"
                placeholder="우편번호"
                id="postcode"
                value={postcode}
                readOnly
              />
              <button type="button" onClick={handleSearchAddress}>
                검색
              </button>
            </div>

            <div className="myPage-row info-address">
              <input
                type="text"
                name="address"
                placeholder="도로명/지번 주소"
                id="address"
                value={address}
                readOnly
              />
            </div>

            <div className="myPage-row info-address">
              <input
                type="text"
                name="detailAddress"
                placeholder="상세 주소"
                id="detailAddress"
                value={detailAddress}
                onChange={handleChange}
              />
            </div>

            <button className="myPage-submit">수정하기</button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default MyPageInfo;
