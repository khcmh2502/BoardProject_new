// 예시: 유저 정보 조회 시
const fetchUserInfo = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get('/member/info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true
    });

    console.log(res.data);
  } catch (err) {
    if (err.response?.status === 401) {
      // Access Token 만료 → Refresh Token 사용해서 재발급
      await reissueAccessToken();
      fetchUserInfo(); // 재시도
    } else {
      console.error(err);
    }
  }
};


const reissueAccessToken = async () => {
  try {
    const res = await axios.post('/auth/refresh', null, {
      withCredentials: true // Refresh Token이 HttpOnly 쿠키에 있다면
    });

    localStorage.setItem('accessToken', res.data.accessToken);
  } catch (err) {
    alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
    localStorage.removeItem('accessToken');
    window.location.href = "/login";
  }
};