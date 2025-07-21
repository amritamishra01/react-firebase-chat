import { onAuthStateChanged } from "firebase/auth"
import Chat from "./components/chat/Chat"
import Details from "./components/details/Details"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { useEffect } from "react"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { usechatStore } from "./lib/chatStore"

const App = () => {

  const{currentUser,isLoading,fetchUserInfo}=useUserStore()
  const{chatId}=usechatStore()

// const user=false
useEffect(()=>{
  const unSub=onAuthStateChanged(auth,(user)=>
  {
    fetchUserInfo(user?.uid)
  })
  return()=>{
    unSub();
    // cleanup function
  }

},[fetchUserInfo])
console.log(currentUser)

if(isLoading)
  return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser?(
    <>
      <List />
      {chatId &&<Chat /> }
     {chatId &&<Details />}
     </>
    ):( <Login/>)
        }
        <Notification/>
    </div>
  )
}

export default App