# Chat App Backend

A Node.js backend for the chat application with file upload support using Multer and optional Cloudinary integration.

## Features

- File upload support (images, documents, text files)
- Local file storage with Multer
- Optional Cloudinary cloud storage
- File size validation (10MB limit)
- File type validation
- CORS enabled for frontend integration
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Upload Single File
```
POST /upload/:chatId
Content-Type: multipart/form-data

Body: file (file)
```

### Upload Multiple Files
```
POST /upload-multiple/:chatId
Content-Type: multipart/form-data

Body: files (array of files)
```

### Get Files for Chat
```
GET /files/:chatId
```

### Delete File
```
DELETE /delete/:chatId/:filename
```

## File Types Supported

### Images
- JPEG, JPG, PNG, GIF, WebP

### Documents
- PDF, DOC, DOCX, XLS, XLSX, TXT

### Archives
- ZIP, RAR

## Usage with Frontend

The backend can be used as an alternative to Firebase Storage. Update your frontend upload functions to use these endpoints instead of Firebase Storage.

Example frontend integration:
```javascript
const uploadFile = async (file, chatId) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`http://localhost:5000/upload/${chatId}`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.fileUrl;
};
```

## File Storage

Files are stored locally in the `uploads/` directory, organized by chat ID:
```
uploads/
├── chat1/
│   ├── 1234567890-image.jpg
│   └── 1234567891-document.pdf
└── chat2/
    └── 1234567892-file.txt
```

## Security

- File size limit: 10MB
- File type validation
- Unique filename generation
- Organized storage by chat ID 