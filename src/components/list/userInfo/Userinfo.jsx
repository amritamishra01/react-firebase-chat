import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css";

const Userinfo = () => {

  const{currentUser}=useUserStore()
  return (
    <div className="userInfo">
        <div className="user">
            <img src={currentUser.avatar||"./avatar.png"} alt="" className="userImg" />
            <h2>{currentUser.username }</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" className="icon" />
                <img src="./video.png" alt="" className="icon" />
                <img src="./edit.png" alt="" className="icon" />

        </div>
    </div>
  )
}

export default Userinfo