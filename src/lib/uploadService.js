import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Configuration - set to 'firebase' or 'multer'
const UPLOAD_SERVICE = 'firebase'; // Change this to 'multer' to use the backend
const MULTER_BASE_URL = 'http://localhost:5000'; // Update this to your backend URL

// Firebase upload function
const uploadToFirebase = (file, chatId = 'general') => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const storage = getStorage();
    const storageRef = ref(storage, `chat/${chatId}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Firebase upload progress:', progress + '%');
      }, 
      (error) => {
        console.error('Firebase upload error:', error);
        reject(error);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            fileUrl: downloadURL,
            fileName: file.name,
            fileType: file.type,
            service: 'firebase'
          });
        } catch (error) {
          console.error('Error getting Firebase download URL:', error);
          reject(error);
        }
      }
    );
  });
};

// Multer backend upload function
const uploadToMulter = async (file, chatId = 'general') => {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${MULTER_BASE_URL}/upload/${chatId}`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return {
      fileUrl: result.fileUrl,
      fileName: result.fileName,
      fileType: result.fileType,
      service: 'multer'
    };
  } catch (error) {
    console.error('Multer upload error:', error);
    throw error;
  }
};

// Main upload function that switches between services
const upload = async (file, chatId = 'general') => {
  // File validation
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size should be less than 10MB');
  }

  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  const isImage = allowedImageTypes.includes(file.type);
  const isAllowedFile = allowedFileTypes.includes(file.type);
  
  if (!isImage && !isAllowedFile) {
    throw new Error('File type not supported. Please upload images, documents, or text files.');
  }

  // Choose upload service
  if (UPLOAD_SERVICE === 'multer') {
    return await uploadToMulter(file, chatId);
  } else {
    return await uploadToFirebase(file, chatId);
  }
};

// Upload multiple files
const uploadMultiple = async (files, chatId = 'general') => {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('No files provided');
  }

  if (UPLOAD_SERVICE === 'multer') {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`${MULTER_BASE_URL}/upload-multiple/${chatId}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      return result.files.map(file => ({
        ...file,
        service: 'multer'
      }));
    } catch (error) {
      console.error('Multer multiple upload error:', error);
      throw error;
    }
  } else {
    // Firebase doesn't have a built-in multiple upload, so we'll do it sequentially
    const uploadPromises = files.map(file => uploadToFirebase(file, chatId));
    return await Promise.all(uploadPromises);
  }
};

// Delete file
const deleteFile = async (fileUrl, chatId, fileName) => {
  if (UPLOAD_SERVICE === 'multer') {
    try {
      const response = await fetch(`${MULTER_BASE_URL}/delete/${chatId}/${fileName}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Multer delete error:', error);
      throw error;
    }
  } else {
    // Firebase deletion would require additional setup
    console.warn('File deletion not implemented for Firebase Storage');
    return { success: false, message: 'Deletion not supported for Firebase Storage' };
  }
};

// Get files for a chat
const getChatFiles = async (chatId) => {
  if (UPLOAD_SERVICE === 'multer') {
    try {
      const response = await fetch(`${MULTER_BASE_URL}/files/${chatId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get files');
      }

      return await response.json();
    } catch (error) {
      console.error('Get files error:', error);
      throw error;
    }
  } else {
    // Firebase doesn't have a built-in list files endpoint
    console.warn('File listing not implemented for Firebase Storage');
    return { files: [] };
  }
};

export default upload;
export { uploadMultiple, deleteFile, getChatFiles, UPLOAD_SERVICE }; 