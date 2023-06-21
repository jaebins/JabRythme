export default function Users(){
  const openSetting = () => {
    window.open(`${process.env.PUBLIC_URL}/setting`, "설정", "width=300px height=700px resizable=no")
  }

    return(
        <div className="users">
          <div className="users-setting" onClick={() => openSetting()}>설정</div>
          <div className="users-userInfo">
            <div className="users-userInfo-user">회원가입</div>
            <div className="users-userInfo-user">로그인</div>
          </div>
        </div>
    )
}