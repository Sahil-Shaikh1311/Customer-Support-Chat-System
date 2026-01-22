 Customer-Support-Chat-System


A full-stack real-time customer support chat application built using **Django, Django REST Framework, Django Channels (WebSockets), React, and Tailwind CSS**.  
The system enables real-time communication between customers and support agents with features such as typing indicators, chat history, chat resolution, and responsive UI.

---
  Features

🔹 Authentication & Roles
- Role-based access: **Agent** and **Customer**
- Secure authentication using JWT
- Protected API endpoints

🔹 Real-Time Chat
- Real-time messaging using **WebSockets (Django Channels)**
- Typing indicator for both agent and customer
- Automatic message updates without page refresh

🔹 Chat Management
- Customers can start new chats
- Agents can view all assigned chats
- Chat history is preserved
- Agents can resolve and reopen chats
- Latest chats appear at the top based on recent activity

🔹 Responsive UI
- Fully responsive design (desktop, tablet, mobile)
- Sidebar collapses on smaller screens
- Smooth UI interactions using Tailwind CSS

🔹 Security & Best Practices
- Sensitive data stored in environment variables
- `.env` excluded from version control
- Clean project structure

---

🛠 Tech Stack

 Backend
- Django
- Django REST Framework
- Django Channels
- WebSockets (ASGI)
- PostgreSQL
- Redis (Channels Layer)
- JWT Authentication

 Frontend
- React (TypeScript)
- Tailwind CSS
- Axios
- WebSocket API
- Lucide Icons

---

 📁 Project Structure

 Customer-Support-Chat-System/
├── backend/
│   ├── backend/
│   ├── chat/
│   ├── manage.py
│   ├── requirements.txt
│   └── docker-compose.yml
├── frontend/
│   └── myApp/
│       ├── src/
│       └── package.json
├── .env.example
├── .gitignore
└── README.md



---

⚙️ Setup Instructions

1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/Customer-Support-Chat-System.git
cd Customer-Support-Chat-System

 2️⃣ Backend Setup (Docker + Redis + Daphne)

Make sure **Docker** and **Docker Compose** are installed.

```bash
cd backend

Create .env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=db
DB_PORT=5432
REDIS_HOST=redis
REDIS_PORT=6379


---

3️⃣ ADD: **Docker & Redis Architecture Section** (NEW)

Add this section **after Setup Instructions** 👇

```md
Docker & Redis Architecture

- The backend runs inside Docker containers using Docker Compose
- Redis is used as the channel layer for WebSocket communication
- Daphne is used as the ASGI server to handle HTTP and WebSocket traffic
- Services communicate internally via Docker networking

This setup ensures scalability, real-time performance, and production-ready deployment.

 🔄 WebSocket Flow (Django Channels + Redis)

1. Client establishes WebSocket connection via Daphne
2. Messages and typing events are sent to Django Channels
3. Redis acts as the channel layer for message broadcasting
4. Events are delivered to all participants in the chat room
5. Frontend updates UI in real-time without refresh

 ▶️ Running the Application

 Backend (Docker)
```bash
docker-compose up

cd frontend/myApp
npm install
npm run dev

