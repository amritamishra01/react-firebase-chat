
import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { doc, getDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { usechatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId, user,isCurrentUserBlocked,isReceiverBlocked} = usechatStore();
  const { currentUser } = useUserStore();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "" && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl ? { img: imgUrl } : {}),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      for (const id of userIDs) {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text || "📷 Image";
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          }
        }
      }

      setText("");
      setImg({ file: null, url: "" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem, ipsum dolor sit amet consectetur.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" className="icon" />
          <img src="./video.png" alt="" className="icon" />
          <img src="./info.png" alt="" className="icon" />
        </div>
      </div>

      <div className="center">
        {chat?.messages?.map((message) => {
          const isOwn = message.senderId === currentUser?.id;

        //   console.log(
        //     "MSG:",
        //     message.text || "[image]",
        //     "| Sender:",
        //     message.senderId,
        //     "| You:",
        //     currentUser?.id,
        //     "| Own:",
        //     isOwn
        //   );

          return (
            <div className={isOwn ? "message own" : "message"} key={message?.createdAt}>
              <div className="texts">
                {message.img && <img src={message.img} alt="image" />}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        {/* Previewing uploaded image before sending */}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="preview" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="Upload Icon" className="icon" />
            <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          </label>
          <img src="./camera.png" alt="" className="icon" />
          <img src="./mic.png" alt="" className="icon" />
        </div>

        <input
          type="text"
          placeholder={(isCurrentUserBlocked||isReceiverBlocked)?"you cannot send a message": "Type a message"}
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked||isReceiverBlocked }
        />

        <div className="emoji">
          <img src="./emoji.png" alt="" className="icon" onClick={() => setOpen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>

        <button className="sendButton" onClick={handleSend}
        disabled={isCurrentUserBlocked||isReceiverBlocked }>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
