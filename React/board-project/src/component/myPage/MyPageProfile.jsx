import React, { useRef, useState } from "react";
import SideMenu from "./SideMenu";
import "../../css/MyPageProfile.css";
import defaultImageUrl from "../../assets/user.png";
import { useUser } from "../common/UserContext";
import axiosInstance from "../../api/axiosInstance";

function MyPageProfile() {
  const { loginMember, setLoginMember } = useUser();

  const [profileImg, setProfileImg] = useState(
    loginMember.profileImg
      ? `http://localhost${loginMember.profileImg}`
      : defaultImageUrl
  );
  const [imageFile, setImageFile] = useState(null);
  const [statusCheck, setStatusCheck] = useState(-1); // -1: 초기, 0: 삭제, 1: 새선택
  const imageInputRef = useRef();
  const MAX_SIZE = 1024 * 1024 * 5; // 5MB

  // 프로필 이미지 변경 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= MAX_SIZE) {
        setImageFile(file);
        setProfileImg(URL.createObjectURL(file));
        setStatusCheck(1);
      } else {
        alert("5MB 이하의 이미지만 업로드 가능합니다.");
        imageInputRef.current.value = "";
      }
    }
  };

  // 프로필 이미지 삭제 함수
  const deleteImage = () => {
    setImageFile(null);
    setProfileImg(defaultImageUrl);
    setStatusCheck(0);
  };

  // 이미지 변경 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (statusCheck === -1) {
      // 변경 사항이 없는 경우 제출 막기
      alert("이미지 변경 후 제출하세요");
      return;
    }

    const formData = new FormData();
    if (statusCheck === 1) {
      // 새로 이미지 선택한 경우만 첨부
      formData.append("profileImg", imageFile); // 'profileImg'는 서버에서 받을 변수명
    }

    const token = localStorage.getItem("accessToken");

    try {
      const response = await axiosInstance.post(
        "http://localhost/myPage/update/profile",
        formData,
        // FormData 객체를 전송할 때 Content-Type을 자동으로 설정
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response);
      if (response.status == 200) {
        alert("프로필 이미지 변경 성공");
      } else {
        alert("업로드 실패");
      }
    } catch (error) {
      console.error("업로드 중 오류 발생", error);
    }
  };

  return (
    <main>
      <section className="myPage-content">
        {/* 사이드 메뉴 */}
        <SideMenu />

        <section className="myPage-main">
          <h1 className="myPage-title">프로필</h1>
          <span className="myPage-subject">
            프로필 이미지를 변경할 수 있습니다.
          </span>

          {/* 프로필 이미지 */}
          <form onSubmit={handleSubmit}>
            <div className="profile-image-area">
              <img src={profileImg} alt="프로필 이미지" id="profileImg" />
              <span id="deleteImage" onClick={deleteImage}>
                x
              </span>
            </div>

            {/* 이미지 변경 */}
            <div className="profile-btn-area">
              <label htmlFor="imageInput">이미지 선택</label>
              <input
                type="file"
                name="profileImg"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
              />
              <button type="submit">변경하기</button>
            </div>

            {/* 이메일 */}
            <div className="myPage-row">
              <label>이메일</label>
              <span>{loginMember.memberEmail}</span>
            </div>

            {/* 가입일 */}
            <div className="myPage-row">
              <label>가입일</label>
              <span>{loginMember.enrollDate}</span>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

export default MyPageProfile;
