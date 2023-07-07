import { useEffect } from "react";
import { useState } from "react"
import cookies from "react-cookies";

export default function Users(){
  const[isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if(cookies.load("id") != undefined){
      setIsLogin(true);
    }
  }, [])

  const openSetting = () => {
    window.open(`${process.env.PUBLIC_URL}/setting`, "설정", "width=300px height=700px resizable=no")
  }

  const goLogin = (mode) => {
    window.location.href = `${process.env.PUBLIC_URL}/${mode}`
  }
    return(
        <div className="users">
          <div className="users-setting" onClick={() => openSetting()}>설정</div>
          {isLogin ? 
            <div className="users-userInfo">
              <div className="users-userInfo-user" onClick={() => {cookies.remove("id"); cookies.remove("pw"); setIsLogin(false);}}>로그아웃</div>
            </div>
          : 
            <div className="users-userInfo">
              <div className="users-userInfo-user" onClick={() => goLogin(`register`)}>회원가입</div>
              <div className="users-userInfo-user" onClick={() => goLogin(`login`)}>로그인</div>
            </div>
          }
        </div>
    )
}