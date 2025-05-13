import React, { useState } from 'react';
import SideMenu from './SideMenu';
import "../../css/MyPageProfile.css";
import userImage from '../../assets/user.png';
import { useUser } from '../common/UserContext';

function MyPageProfile() {
  const { loginMember, setLoginMember } = useUser();

  const [profileImg, setProfileImg] = useState(loginMember.profileImg);
  const [email, setEmail] = useState(loginMember.memberEmail); // 임시 이메일
  const [enrollDate, setEnrollDate] = useState(loginMember.enrollDate); // 임시 가입일

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file)); // 이미지 미리보기
    }
  };

  const handleDeleteImage = () => {
    setProfileImg(''); // 이미지 삭제
  };

  return (
    <main>

      <section className="myPage-content">
        {/* 사이드 메뉴 */}
        <SideMenu />

        <section className="myPage-main">
          <h1 className="myPage-title">프로필</h1>
          <span className="myPage-subject">프로필 이미지를 변경할 수 있습니다.</span>

          {/* 프로필 이미지 */}
          <form action="/myPage/profile" method="POST" encType="multipart/form-data" id="profileForm">
            <div className="profile-image-area">
              {profileImg ? (
                <>
                  <img src={profileImg} alt="프로필 이미지" id="profileImg" />
                  <span id="deleteImage" onClick={handleDeleteImage}>
                    x
                  </span>
                </>
              ) : (
                <img src={userImage} alt="기본 프로필 이미지" id="profileImg" />
              )}
            </div>

            {/* 이미지 변경 */}
            <div className="profile-btn-area">
              <label htmlFor="imageInput">이미지 선택</label>
              <input type="file" name="profileImg" id="imageInput" accept="image/*" onChange={handleImageChange} />
              <button type="submit">변경하기</button>
            </div>

            {/* 이메일 */}
            <div className="myPage-row">
              <label>이메일</label>
              <span>{email}</span>
            </div>

            {/* 가입일 */}
            <div className="myPage-row">
              <label>가입일</label>
              <span>{enrollDate}</span>
            </div>
          </form>
        </section>
      </section>

    </main>
  );
}

export default MyPageProfile;
