import { useEffect } from 'react';

const Footer = ({ message }) => {
  useEffect(() => {
    if (message) alert(message);
  }, [message]);

  return (
    <footer>
      <p>Copyright &copy; KH Information Educational Institute A-Class</p>

      <article>
        <a href="#">프로젝트 소개</a>
        <span> | </span>
        <a href="#">이용약관</a>
        <span> | </span>
        <a href="#">개인정보처리방침</a>
        <span> | </span>
        <a href="#">고객센터</a>
      </article>
    </footer>
  );
};

export default Footer;
