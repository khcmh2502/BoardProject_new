// cookieUtil.js

// 쿠키 세팅
export const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  // encodeURIComponent 인코딩 -> user01%40kh.or.kr
  // 쿠키 값에 공백, 세미콜론, 특수 문자 등이 포함되어 있으면 
  // 문제가 생길 수 있기 때문에 보안과 안정성을 위해 일반적인 방법
  // @ → %40, : → %3A, = → %3D
};

// 쿠키 얻어오기
export const getCookie = (name) => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : ''; 
  // decodeURIComponent 디코딩 -> 쿠키값 꺼낼때 다시 정상적으로 user01@kh.or.kr로 복원
};

// 쿠키 삭제하기
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};