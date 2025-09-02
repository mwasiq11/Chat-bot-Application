<img width="1439" height="738" alt="form" src="https://github.com/user-attachments/assets/f054f8e6-a193-477c-ae9a-37904f1a5e34" />
<img width="1440" height="739" alt="main-page" src="https://github.com/user-attachments/assets/8502827a-0127-4c74-8ad4-4a4e8e35b9b8" />
<img width="1440" height="738" alt="response-page" src="https://github.com/user-attachments/assets/9a2d5812-49b8-468e-8c0f-64d08311bed7" />



🤖 Botrix – AI Chatbot Application

Botrix is a full-stack AI chatbot built with React, Tailwind CSS, Firebase, and OpenAI’s LLM Thread API. It provides secure authentication, persistent conversation history, and real-time chat storage powered by Firestore.

🚀 Features

🔗 OpenAI LLM Thread API Integration → Smart, contextual AI conversations

🔑 Firebase Authentication → Secure signup/login with session management

💬 Chat History → Saves prompts & responses in Firestore

🃏 Quick Prompt Cards – Suggests common and frequently used prompts

📁 File Attachments – Add attachments in your chat flow

🔄 Threaded Conversations → Continue previous discussions seamlessly

🎨 Modern UI → Responsive and elegant interface with React + Tailwind CSS

⚡ Real-Time Database → Instant updates with Firebase Firestore

🛠️ Tech Stack

Frontend: React, Tailwind CSS, JavaScript

Backend/Database: Firebase Firestore

Authentication: Firebase Auth

AI Engine: OpenAI LLM Thread API

🏠 Dashboard with Prompt Cards

💬 Chat Interface

Persistent history sidebar

Smart AI responses

File attachments support

📂 Project Structure

├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # App pages (Login, Chat, History, etc.)
│   ├── firebase/       # Firebase config & services
│   ├── utils/          # Helper functions
│   └── App.jsx         # Main App component
├── public/assets            # Static assets
├── package.json
└── README.md

⚡ Getting Started

1. Clone the Repository
git clone [https:github.com/mwasiq11/Chat-bot-Application/tree/main](https://github.com/mwasiq11/Chat-bot-Application)
cd botrix

2. Install Dependencies
npm install

3. Setup Firebase

Create a Firebase project

Enable Firestore & Authentication

Add your Firebase config to firebaseConfig.js

4. Setup OpenAI API

Get your API key from OpenAI

Add it to your .env file:

VITE_OPEN_AI_API_KEY=your_api_key_here
VITE_ASSISTENT_ID=your_assistant_id_here

5. Run the Application
npm run dev

🔐 Authentication Flow

Users sign up or log in via Firebase Auth

Each user’s chats are saved under their unique UID

Conversations are persisted in Firestore for history access

🤝 Contribution

Contributions are welcome! Fork this repo and submit a PR with improvements.
