 
import { useEffect, useState } from "react";
import "./chatList.css";
// import AddUser from "./addUser/addUser";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useUserStore } from "../../../lib/userStore";
import { db } from "../../../lib/firebase";
import AddUser from "./addUser/AddUser";
import { usechatStore } from "../../../lib/chatStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId,changeChat } = usechatStore();
  console.log(chatId);

  useEffect(() => {
    if (!currentUser?.id) return; // Ensure user is logged in before subscribing

    // Listening to the specific document of userchats using doc reference
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const data = res.data();
      const items = data?.chats || [];

      // Mapping through the chat items and fetching user data for each chat
      // const promise = items.map(async (item) => {
      //   const userDocRef = doc(db, "users", item.receiverId); // Correct document reference for user
      //   const userDocSnap = await getDoc(userDocRef);
      //   const user = userDocSnap.data();
      //   return { ...item, user };
      // });




      const promise = items.map(async (item) => {
        if (!item?.receiverId) {
          console.warn("Missing receiverId for item:", item);
          return { ...item, user: null }; // or handle it however you prefer
        }
      
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
      
        const user = userDocSnap.exists() ? userDocSnap.data() : null;
        return { ...item, user };
      });
      


      const chatData = await Promise.all(promise);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    // Clean up the subscription when the component unmounts
    return () => unSub();
  }, [currentUser?.id]); // Effect dependency on currentUser.id



 const handleSelect= async(chat)=>{

  const userChats = chats.map((item) => {
    const { user, ...rest } = item;
    return rest;
  });

  const chatIndex = userChats.findIndex(
    (item) => item.chatId === chat.chatId
  );

  userChats[chatIndex].isSeen = true;

  const userChatsRef = doc(db, "userchats", currentUser.id);

  try {
    await updateDoc(userChatsRef, {
      chats: userChats,
    });
    
  } catch (err) {
    console.log(err);
  }
  changeChat(chat.chatId, chat.user);
};

const filteredChat = chats.filter((c) =>
  c.user.username.toLowerCase().includes(input.toLowerCase())
);



  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" 
          onChange={(e)=>setInput(e.target.value)}
          className="searchInput" />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="searchIcon"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {filteredChat.map((chat) => (
        <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)}
        style={{
          backgroundColor:chat?.isSeen?"transparent":"#4875e9",

        }}>
          <img
            src={chat.user.blocked.includes(currentUser.id)?"./avatar.png":chat.user.avatar || "./avatar.png"}
            alt=""
            className="userImg"
          />
          <div className="texts">
            <span>{chat.user.blocked.includes(currentUser.id)?"User":chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;

