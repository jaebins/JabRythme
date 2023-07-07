import "./Login.css"
import Users from "../users.js"
import axios from "axios"
import { useEffect } from "react"
import cookies from "react-cookies";

export default function Login(){
    useEffect(() => {
        if(cookies.load("id") != undefined){
            alert("이미 로그인 되있습니다.");
            window.location.href = `${process.env.PUBLIC_URL}/`;
        }
    }, [])

    const registerProcess = () =>{
        let id = document.getElementById("id").value;
        let pw = document.getElementById("pw").value;
        const url = `http://localhost:8000/registerProcess?id=${id}&pw=${pw}`;
        axios.post(url, {
            headers:{
                "access-control-allow-origin":"*"
            },
        }).then((res) =>{
            if(res.data === "suc"){
                alert("회원가입을 성공하였습니다.");
                window.location.href = `${process.env.PUBLIC_URL}/`
                return 0;
            }
            alert("회원가입을 실패하였습니다.");
        }).catch((err) => {
            alert(err);
        })
    }

    return(
        <div className="Login">
            <Users></Users>
            <div className="Login-head">
                <div className="Login-head-title">REGISTER</div>
            </div>
            <div className="Login-body">
                <form>
                    <input className="Login-infors" id="id" type="text" placeholder="아이디를 입력해주세요."></input><p/><p/>
                    <input className="Login-infors" autocomplete="off" id="pw" type="password" placeholder="비밀번호를 입력해주세요."></input><p/><p/>
                    <button className="Login-submit" onClick={() => registerProcess()}>로그인</button>
                </form>
            </div>
        </div>
    )
}