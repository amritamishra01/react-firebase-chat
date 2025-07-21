import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL, 
    connectStorageEmulator 
  } from "firebase/storage";
  //   connectStorageEmulator -extra for emulator
  const upload = async (file) => {
    const storage = getStorage();
  
    // ✅ Connect to emulator if on localhost
    if (location.hostname === "localhost") {
      connectStorageEmulator(storage, "localhost", 9200);
    }
    //above line extra wrritten for emulator other than firebase
    const date=new Date();
    const storageRef = ref(storage, `images/${date+file.name}`); // use dynamic file name
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          if (snapshot.state === 'paused') console.log('Upload is paused');
          if (snapshot.state === 'running') console.log('Upload is running');
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };
  
  export default upload;
  