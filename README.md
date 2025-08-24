💬 Real-Time Chat Application

A modern real-time chat application built with React, Firebase (Authentication, Firestore, and Emulator for local storage), and TextTags.
The app supports user authentication, searching users, real-time chat, emoji support, and sharing images.

⚠️ Note: Currently, this project uses Firebase Emulator for image storage, meaning the demo URL will not work globally for image sharing. In future updates, image storage will be migrated to Cloudinary for global access.


🚀 Demo URL

👉 Live Demo:react-firebase-chat-alpha-nine.vercel.app

⚠️ This demo link will not fully work for image upload/sharing features because the app uses Firebase Emulator (local-only).

🖼️ Screenshots & Features


1️⃣ Authentication (Login & Signup)

Users can sign in or sign up with Firebase Authentication. Profile picture uploads are supported during signup.

![Login Screenshot](./Screenshot%202025-08-21%20115930.png)


2️⃣ User Search

Search and add new users by username. Works across different browsers simulating different users.
(Example: One user in Chrome, another in Edge, another in Firefox)

![Profile Screenshot](./Screenshot%202025-08-21%20121805.png)

3️⃣ Real-Time Chatting

Send and receive messages instantly with real-time updates from Firebase Firestore.

### 📂 User Profile
![Profile Screenshot](./Screenshot%202025-08-21%20121805.png)

4️⃣ Image Sharing

Users can upload and share images in the chat. Currently, this works locally with Firebase Emulator, but in the future will be migrated to Cloudinary for global functionality.

![Settings Screenshot](./Screenshot%202025-08-21%20122000.png)




🛠️ Tech Stack

React – Frontend UI

Firebase Authentication – User auth & profile

Firebase Firestore – Real-time database

Firebase Emulator – Local storage for images (temporary)

TextTags – Tagging in chats

CSS / SCSS – Styling



⚠️ Future Enhancements

🌐 Switching from Firebase Emulator → Cloudinary for image uploads.

📱 Mobile responsiveness improvements.

🎥 Add video call and voice call integration.
