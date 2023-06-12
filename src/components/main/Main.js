import './Main.css';

function App() {
  return (
    // https://kjsari99.tistory.com/3/ 리듬게임 박자 계산 블로그
    <div className="Main">
      <div className="Main-head">
        <div className="Main-head-users">
          <div className="Main-head-users-user">회원가입</div>
          <div className="Main-head-users-user">로그인</div>
        </div>
        <div class="head-title" onClick={() => window.location.href=`${process.env.PUBLIC_URL}/`}>JabRythme</div>
      </div>
      <div className="Main-neck"></div>
      <div className="Main-body">
        <button id="Main-body-start" onClick={() => window.location.href="/select"}>♬</button>
      </div>
    </div>
  );
}

export default App;
