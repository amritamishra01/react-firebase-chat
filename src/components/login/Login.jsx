// import { useState } from "react";
// import "./login.css";
// import { toast } from "react-toastify";
// import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
// import { auth,db } from "../../lib/firebase";
// import { doc, setDoc } from "firebase/firestore"; 
// import upload from "../../lib/upload";
// const Login = () => {

// const[avatar, setAvatar] = useState({
//     file:null,
//     url:"",

// })

// const[loading,setLoading]=useState(false)

// const handleAvatar=(e)=>{
//     if(e.target.files[0]){

   
//     setAvatar({
//         file:e.target.files[0],
//         url:URL.createObjectURL(e.target.files[0]),
//     })
// }
// }

// const handleLogin= async(e)=>{
//     e.preventDefault()
//     setLoading(true)
//     const formData=new FormData(e.target);
//         const {email, password}=Object.fromEntries(formData);
//     try{
//         await signInWithEmailAndPassword(auth,email,password)

//     }
//     catch(err){
//         console.log(err)
//         toast.error(err.message)
//     }
//     finally{
//         setLoading(false)
//     }
// }

// // to create values in database
// const handleRegister=async(e)=>{
//     e.preventDefault()
//     setLoading(true)
//     const formData=new FormData(e.target);
//     const {username, email, password}=Object.fromEntries(formData);
//     console.log(username)

//     // VALIDATE INPUTS
//     if (!username || !email || !password)
//         return toast.warn("Please enter inputs!");
//       if (!avatar.file) return toast.warn("Please upload an avatar!");
  
//       // VALIDATE UNIQUE USERNAME
//       const usersRef = collection(db, "users");
//       const q = query(usersRef, where("username", "==", username));
//       const querySnapshot = await getDocs(q);
//       if (!querySnapshot.empty) {
//         return toast.warn("Select another username");
//       }





//     try{
// const res=await createUserWithEmailAndPassword(auth, email, password)

// const imgUrl=await upload(avatar.file)
// // function calling from upload-promise type that's why await is written

// // Add a new document in collection "cities"
// await setDoc(doc(db, "users", res.user.uid), {
//     username: username,
//     email: email,
//     avatar:imgUrl,
//     id: res.user.uid,
//    blocked:[],
//   });

//   await setDoc(doc(db, "userchats", res.user.uid), {
//     chats:[],
//   });


//   toast.success("Registration successful")
//     }
//     catch(err){
//         console.log(err)
//         toast.error("Error while registering")
//     }finally{
//         setLoading(false);
//     }
// }







//   return (
//     <div className="login">
//     <div className="item">
//         <h2>
//             Welcome back,
//         </h2>
//         <form onSubmit={handleLogin}>
//             <input type="text" placeholder="Email" name="email" required/>
//             <input type="password" placeholder="Password" name="password" required/>
//             <button disabled={loading} className="btn">{loading?"Loading":"Sign In"}</button>
//         </form>
//     </div>
//     <div className="separator"></div>
//     <div className="item">
//     <h2>create an Account</h2>
//         <form onSubmit={handleRegister}>
//             <label htmlFor="file" >
//              <img src={avatar.url || "./avatar.png"}></img>
//                 Upload your profile picture</label>
//         <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
//         <input type="text" placeholder="Username" name="username" required/>
//             <input type="text" placeholder="Email" name="email" required/>
//             <input type="password" placeholder="Password" name="password" required/>
//             <button disabled={loading} className="btn">{loading?"Loading":"Sign Up"}</button>
//         </form>
//     </div>
//     </div>
//   )
// }


// export default Login


import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import upload from "../../lib/upload";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      toast.success("Login successful");
    } catch (err) {
      console.log(err);
      if (err.code === 'auth/user-not-found') {
        toast.error("No user found with this email. Please register first.");
      } else {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password) return toast.warn("Please enter inputs!");
    if (!avatar.file) return toast.warn("Please upload an avatar!");

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Upload avatar image and get the URL
      const imgUrl = await upload(avatar.file);

      // Save user data in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      // Initialize user chats in Firestore
      await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });

      // Automatically log in the user after successful registration
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Registration and login successful");

    } catch (err) {
      console.log(err);
      toast.error("Error while registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button disabled={loading} className="btn">
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="avatar" />
            Upload your profile picture
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" placeholder="Username" name="username" required />
          <input type="text" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button disabled={loading} className="btn">
            {loading ? "Loading" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
