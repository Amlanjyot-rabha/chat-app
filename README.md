# Chat Application

A modern real-time chat application built with React, Firebase, and Node.js. Features include user authentication, real-time messaging, file sharing, and profile management.

## Features

 Core Features
- **Real-time Messaging**: Instant message delivery using Firebase
- **User Authentication**: Secure login/signup with Firebase Auth
- **File Sharing**: Send images, documents, and other files
- **Profile Management**: Update profile picture, name, and bio
- **Responsive Design**: Works on desktop and mobile devices
- **Search Users**: Find and start conversations with other users
- **Online Status**: See when users are online or last seen

 File Upload Support
- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, TXT
- **Archives**: ZIP, RAR
- **File Size Limit**: 10MB per file
- **Multiple Storage Options**: Firebase Storage or Multer backend

### 🎨 UI/UX Features
- **Modern Design**: Clean and intuitive interface
- **Dark Theme**: Easy on the eyes
- **Mobile Responsive**: Optimized for all screen sizes
- **Loading States**: Visual feedback for uploads and actions
- **Toast Notifications**: User-friendly error and success messages

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Firebase**: Authentication, Firestore database, and storage
- **React Router**: Client-side routing
- **CSS3**: Modern styling with flexbox and grid



## Project Structure

```
chatapp/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── component/        # Reusable components
│   │   │   ├── leftslide/    # Chat list sidebar
│   │   │   └── rightslide/   # Chat interface
│   │   ├── pages/           # Page components
│   │   │   ├── chat/        # Main chat page
│   │   │   ├── login/       # Authentication page
│   │   │   └── profileUpdate/ # Profile editing page
│   │   ├── context/         # React context for state management
│   │   ├── firebase-config/ # Firebase configuration
│   │   ├── lib/             # Utility functions
│   │   └── assets/          # Images and static files
│   ├── public/              # Public assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend (optional)
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── uploads/            # File storage directory
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (for authentication and database)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chatapp
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage (if using Firebase Storage)
5. Copy your Firebase config to `frontend/src/firebase-config/firebase.js`

### 4. Backend Setup (Optional)
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### 5. Start the Application
```bash
# Frontend (from frontend directory)
npm run dev





## Usage

### Authentication
1. Navigate to the login page
2. Create an account or sign in with existing credentials
3. You'll be redirected to the chat interface

### Starting a Chat
1. Use the search bar to find users by username
2. Click on a user to start a conversation
3. Type your message and press Enter or click the send button

### Sending Files
1. Click the gallery icon in the chat input
2. Select a file (images, documents, archives)
3. The file will be uploaded and sent automatically

### Profile Management
1. Click the three-dot menu in the top-right
2. Select "Edit profile"
3. Update your profile picture, name, and bio
4. Click "Update Profile" to save changes

## API Endpoints (Backend)

### File Upload
- `POST /upload/:chatId` - Upload single file
- `POST /upload-multiple/:chatId` - Upload multiple files
- `GET /files/:chatId` - Get files for a chat
- `DELETE /delete/:chatId/:filename` - Delete a file

## Firebase Collections

### Users
```javascript
{
  id: "user_id",
  userName: "username",
  name: "Display Name",
  bio: "User bio",
  avatar: "profile_image_url",
  email: "user@example.com"
}
```

### Chats
```javascript
{
  chatData: [
    {
      messageId: "message_document_id",
      rId: "recipient_user_id",
      lastMessage: "Last message text",
      updatAt: timestamp,
      messageSeen: boolean,
      messageDelivered: boolean
    }
  ]
}
```

### Messages
```javascript
{
  messages: [
    {
      message: "Message text",
      fileUrl: "file_url_if_attached",
      fileType: "image|file",
      fileName: "original_filename",
      sId: "sender_user_id",
      createAt: timestamp,
      delivered: boolean,
      seen: boolean
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Acknowledgments

- Firebase for authentication and real-time database
- React team for the amazing framework
- Vite for the fast build tool
- All contributors and users of this project 
