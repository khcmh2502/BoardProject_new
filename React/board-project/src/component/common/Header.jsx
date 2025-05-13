import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

const Header = ( {boardTypeList}) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 동작 구현 필요
    console.log('검색어:', query);
    setSearchVisible(true);
  };

  return (
    <>
      <header>
        <section>
          {/* 로고 클릭 시 메인으로 이동 */}
          <Link to="/">
            <img src={logo} alt="메인 로고" id="homeLogo" />
          </Link>
        </section>

        {/* 검색 영역 */}
        <section>
          <article className="search-area">
            <form onSubmit={handleSearch}>
              <fieldset>
                <input
                  type="search"
                  id="query"
                  name="query"
                  placeholder="검색어를 입력해 주세요."
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <input type="hidden" name="key" value="t" />
                <button id="searchBtn" className="fa-solid fa-magnifying-glass"></button>
              </fieldset>
            </form>

          </article>
        </section>

        {/* 미사용 영역 */}
        <section></section>
      </header>

      {/* 내비게이션 */}
      <nav>
        <ul>
          {boardTypeList?.map((boardType) => (
            <li key={boardType.boardCode}  className="chatting-li">
              <Link to={`/board/${boardType.boardCode}`}>
                {boardType.boardName}
              </Link>
            </li>
          ))}
          <li className="chatting-li">
            <Link to="/chatting/list">채팅</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
