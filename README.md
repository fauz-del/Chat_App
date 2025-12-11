Real-Time Chat App (React + Supabase)

A modern real-time chat application built with React, Supabase, and Vite.
Features include real-time messaging, image sharing, user presence, unread message tracking, authentication, and a clean WhatsApp-style UI.


---

🚀 Features

✅ Authentication

Login and signup using Supabase Auth

Users have profile pictures, usernames, and online/offline status


💬 Real-Time Messaging

Messages update instantly using Supabase Realtime

Smooth auto-scroll to newest message


🖼️ Image Sharing

Upload and send images through Supabase Storage

Image preview inside chat bubbles


📌 Unread Message System

Messages marked as read when opened

Realtime update of unread badges in ChatList


😊 Emoji Support

Integrated emoji picker for fun messaging


🧩 Modular File Structure

Everything is separated into clean folders:

src/
 ├── App.jsx
 ├── components/
 │    ├── chat/
 │    ├── list/
 │    ├── detail/
 │    ├── login/
 │    ├── loading/
 │    └── notification/
 ├── lib/
 │    └── supabase.js
 └── utils/
      └── Kitty.jpg


---

📦 Tech Stack

Frontend

React (Hooks)

Vite

SCSS

Emoji Picker

Lucide Icons


Backend

Supabase Database

Supabase Authentication

Supabase Realtime

Supabase Storage



---

⚙️ Installation & Setup

1️⃣ Clone the project

git clone https://github.com/yourusername/chat-app.git
cd chat-app

2️⃣ Install dependencies

npm install

3️⃣ Create Supabase project

Go to https://supabase.com → create a new project.

4️⃣ Set up the Database Table

Create a table named messages:

Column	Type	Notes

id	bigint	primary key (auto increment)
sender_id	uuid	FK → auth.users
receiver_id	uuid	FK → auth.users
content	text	nullable
image_url	text	nullable
read	boolean	default: false
created_at	timestamp	default: now()


Then enable Realtime on this table.

5️⃣ Supabase Storage

Create a bucket:

chat-images

Set it to public.

6️⃣ Configure Environment Variables

Create .env file:

VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key

7️⃣ Start the App

npm run dev


---

🧪 How It Works

🔹 Real-Time Listener

Chat.jsx subscribes to Supabase Realtime and updates messages instantly.

🔹 Marking Messages as Read

When the user opens a chat:

unread messages are updated to read = true

ChatList updates immediately


🔹 Image Upload

Files are uploaded to storage:

chat-images/userid-timestamp.jpg

Then the public URL is sent as a message.


---

📁 Main Components

ChatList.jsx

Shows all users you have chats with

Displays unread message badges

Select a chat to open it


Chat.jsx

Full messaging UI

Emoji picker

Image upload

Realtime updates


UserInfo.jsx

Shows current user details

Logout button


Detail.jsx

Shows selected user details



---

🧑‍💻 Future Enhancements

Typing indicator

Message reactions

Online/offline presence indicator per chat

Push notifications

Group chats



---

📝 License

This project is completely open-source.
Feel free to edit, improve, or expand it.


---
