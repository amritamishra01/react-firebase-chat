// import React, { useState } from 'react'
// import "./addUser.css";
// import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
// import { db } from '../../../../lib/firebase';
// const AddUser = () => {
// const [user,setUser]=useState(null)


// const handleSearch = async (e) => {
//   e.preventDefault();
//   const formData = new FormData(e.target);
//   const username = formData.get("username");

//   try {
//     const userRef = collection(db, "users");
//     const q = query(userRef, where("username", "==", username));
//     const querySnapShot = await getDocs(q);

//     if (!querySnapShot.empty) {
//       setUser(querySnapShot.docs[0].data());
//     } else {
//       setUser(null);
//     }
//   } catch (err) {
//     console.log(err);
//   }
  
// };

// const handleAdd= async()=>{
//   const chatRef=collection(db,"chats")
//   const userChatsRef=collection(db,"userchat")
//   try{
// const newChatRef=doc(chatRef)

//     await setDoc (chatRef,{
//       createdAt:serverTimestamp(),
//       messages:[],
      
//     });
//     console.log(newChatRef.id)

//   }catch(err){
//     console.log(err)
  
//   }

// }
// import React, { useState } from 'react';
// import "./addUser.css";
// import { collection, doc, getDocs, query, serverTimestamp, setDoc, where, updateDoc } from "firebase/firestore";
// import { db } from '../../../../lib/firebase';

// const AddUser = () => {
//   const [user, setUser] = useState(null);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const username = formData.get("username");

//     try {
//       const userRef = collection(db, "users");
//       const q = query(userRef, where("username", "==", username));
//       const querySnapShot = await getDocs(q);

//       if (!querySnapShot.empty) {
//         const foundUser = querySnapShot.docs[0].data();
//         setUser(foundUser);
        
//         // Log the user ID to the console
//         console.log("Found user ID:", foundUser.id);  // Assuming `id` is the unique identifier
//       } else {
//         setUser(null);
//         console.log("User not found.");
//       }
//     } catch (err) {
//       console.log("Error fetching user:", err);
//     }
//   };

//   // const handleAdd = async () => {
//   //   if (!user) {
//   //     console.log("No user found to add to chat.");
//   //     return;
//   //   }

//   //   const chatRef = collection(db, "chats");
//   //   const userChatsRef = collection(db, "userchats");

//   //   try {
//   //     // Create a new chat document in the "chats" collection
//   //     const newChatRef = doc(chatRef);  // Creates a new document reference
//   //     await setDoc(newChatRef, {
//   //       createdAt: serverTimestamp(),
//   //       messages: [],
//   //     });

//   //     console.log("New chat created with ID:", newChatRef.id);

//   //     // Add the new chat reference to the user in the "userchats" collection
//   //     const userChatRef = doc(userChatsRef, user.id);  // Assuming `user.id` is the user's unique ID in Firestore
//   //     await updateDoc(userChatRef, {
//   //       chats: [...(user.chats || []), newChatRef.id],  // Add new chat ID to user's "chats" field
//   //     });

//   //     console.log("User's chat list updated.");
//   //   } catch (err) {
//   //     console.log("Error adding chat:", err);
//   //   }
//   // };





//   const handleAdd = async () => {
//     if (!user) {
//       console.log("No user found to add to chat.");
//       return;
//     }
  
//     const chatRef = collection(db, "chats");
//     const userChatsRef = collection(db, "userchats");
  
//     try {
//       const newChatRef = doc(chatRef);
  
//       await setDoc(newChatRef, {
//         createdAt: serverTimestamp(),
//         messages: [],
//         receiverId: user.id,
//         senderId: currentUser?.id, // if you have it
//       });
  
//       console.log("New chat created with ID:", newChatRef.id);
  
//       const userChatRef = doc(userChatsRef, user.id);
//       await setDoc(userChatRef, {
//         chats: [...(user.chats || []), newChatRef.id],
//       }, { merge: true });
  
//       console.log("User's chat list updated.");
//     } catch (err) {
//       console.log("Error adding chat:", err);
//     }
//   };
  




//   return (
//     <div className='addUser'>
//         <form  onSubmit={handleSearch}>
//             <input type="text" placeholder='Username' name="username" />
//             <button>Search</button>
//         </form>

    
//     { user&&   <div className="user">
//             <div className="detail">
//                 <img src={user.avatar||"./avatar.png"} alt="" />
//                 <span>user.username</span>
//             </div>
//             <button onClick={handleAdd}>Add User</button>
//         </div>
//         }
//     </div>
//   )
// }

// export default AddUser





import React, { useState } from 'react';
import "./addUser.css";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from '../../../../lib/firebase';
import { useUserStore } from '../../../../lib/userStore';

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore(); // your custom user hook

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const foundDoc = querySnapShot.docs[0];
        const foundUser = foundDoc.data();
        foundUser.id = foundDoc.id; // ✅ Attach Firestore doc ID
        setUser(foundUser);
        console.log("Found user ID:", foundUser.id);
      } else {
        setUser(null);
        console.log("User not found.");
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  };

  const handleAdd = async () => {
    if (!user) {
      console.log("No user found to add to chat.");
      return;
    }

    if (!currentUser || !currentUser.id) {
      console.log("No logged-in user.");
      return;
    }

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef); // Create new chat doc reference

      // Create the chat in "chats" collection
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        receiverId: user.id,
        senderId: currentUser.id,
      });

      const currentTime = new Date().toISOString();

      // Add chat info to searched user's userchats
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: currentTime,
        }),
      });

      // Add chat info to current user's userchats
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: currentTime,
        }),
      });

      console.log("Chat successfully added for both users.");
    } catch (err) {
      console.log("Error adding chat:", err);
    }
  };

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder='Username' name="username" />
        <button>Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
