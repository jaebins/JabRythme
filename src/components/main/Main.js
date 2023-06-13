import './Main.css';
import Users from "../users.js"

function App() {
  return (
    <div className="Main">
      <div className="Main-head">
        <Users></Users>
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
