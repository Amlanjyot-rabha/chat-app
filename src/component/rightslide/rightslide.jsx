import React, { useContext, useRef, useState, useEffect } from 'react'
import './rightslide.css'
import assets from '../../assets/assets'
import { appContext } from '../../context/context'
import { db } from '../../firebase-config/firebase.js'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import upload from '../../lib/uploadService.js'
import ThreeDotMenu from './ThreeDotMenu';

const RightSlide = ({ onBack }) => {
  const messagevalue = useRef()
  const chatEndRef = useRef()
  const fileInputRef = useRef()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { messageId, userData, selectedChat, messages, onlineUsers } = useContext(appContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const uploadFile = async (file) => {
    if (!file) return null
    
    try {
      const uploadResult = await upload(file, messageId)
      return uploadResult.fileUrl
    } catch (error) {
      console.error('File upload error:', error)
      toast.error(error.message || 'Failed to upload file')
      return null
    }
  }

  const sendMessage = async (messageText, fileUrl = null, fileType = null, fileName = null) => {
    if (!messageId || (!messageText && !fileUrl)) return

    try {
      const messageRef = doc(db, 'messages', messageId)
      const chatsRef = doc(db, 'chats', userData.id)
      const recipientChatsRef = doc(db, 'chats', selectedChat.id)

      const newMessage = {
        message: messageText,
        fileUrl,
        fileType: fileType || (fileUrl ? (fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image' : 'file') : null),
        fileName: fileName || (fileUrl ? fileUrl.split('/').pop().split('_').slice(1).join('_') : null),
        sId: userData.id,
        createAt: new Date().toISOString(),
        delivered: false,
        seen: false
      }

      await updateDoc(messageRef, {
        messages: arrayUnion(newMessage)
      })

      // Update last message in both users' chat lists
      const lastMessageText = fileUrl 
        ? `Sent ${newMessage.fileType === 'image' ? 'an image' : 'a file'}`
        : messageText

      const updateLastMessage = async (ref, isRecipient = false) => {
        const doc = await getDoc(ref)
        const chatData = doc.data().chatData
        const updatedChatData = chatData.map(chat => 
          chat.messageId === messageId 
            ? { 
                ...chat, 
                lastMessage: lastMessageText, 
                updatAt: Date.now(),
                messageSeen: !isRecipient,
                messageDelivered: !isRecipient
              }
            : chat
        )
        await updateDoc(ref, { chatData: updatedChatData })
      }

      await updateLastMessage(chatsRef)
      await updateLastMessage(recipientChatsRef, true)

      if (messageText) {
        messagevalue.current.value = ''
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)
    try {
      const uploadResult = await upload(file, messageId)
      if (uploadResult.fileUrl) {
        await sendMessage('', uploadResult.fileUrl, uploadResult.fileType, uploadResult.fileName)
        toast.success('File sent successfully!')
      }
    } catch (error) {
      console.error('Error handling file upload:', error)
      toast.error(error.message || 'Failed to send file')
    } finally {
      setIsUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleSend = async () => {
    const messageText = messagevalue.current.value.trim()
    if (messageText) {
      await sendMessage(messageText)
    }
  }

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      return ''
    }
  }

  const getLastSeen = () => {
    const userStatus = onlineUsers[selectedChat?.id]
    if (!userStatus) return ''
    
    if (userStatus.online) {
      return 'online'
    } else if (userStatus.lastSeen) {
      const lastSeen = new Date(userStatus.lastSeen)
      const now = new Date()
      const diff = now - lastSeen
      
      if (diff < 60000) return 'last seen just now'
      if (diff < 3600000) return `last seen ${Math.floor(diff / 60000)} minutes ago`
      if (diff < 86400000) return `last seen ${Math.floor(diff / 3600000)} hours ago`
      return `last seen ${lastSeen.toLocaleDateString()}`
    }
    return ''
  }

  const getFileIcon = (fileName) => {
    if (!fileName) return '📎'
    const extension = fileName.split('.').pop().toLowerCase()
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      txt: '📄',
      zip: '📦',
      rar: '📦',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      webp: '🖼️'
    }
    return iconMap[extension] || '📎'
  }

  if (!selectedChat) {
    return (
      <div className="chat-box empty-chat">
        <div className="empty-chat-message">
          <h2>Select a chat to start messaging</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-box">
      <div className="chat-user">
        <div className="chat-user-left">
          <img src={assets.arrow_icon} alt="Back" className="back-button" onClick={onBack} />
          <img src={selectedChat.avatar || assets.profile_img} alt="" className='profile'/>
          <div className="user-info">
            <p>{selectedChat.userName}</p>
            <span className="last-seen">{getLastSeen()}</span>
          </div>
        </div>
        <div className="chat-user-right">
          <ThreeDotMenu 
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            onLogout={() => {}} 
            onEditProfile={() => {}} 
          />
        </div>
      </div>

      <div className={`chat-msg ${isMenuOpen ? 'no-scroll' : ''}`}>
        {messages.map((msg, index) => {
          const isSender = msg.sId === userData.id
          return (
            <div key={index} className={isSender ? 's-msg' : 'r-msg'}>
              {msg.fileUrl ? (
                msg.fileType === 'image' ? (
                  <img className="sending-image" src={msg.fileUrl} alt="Sent image" />
                ) : (
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="file-message">
                    {getFileIcon(msg.fileName)} {msg.fileName || 'Download File'}
                  </a>
                )
              ) : (
                <p className='msg'>{msg.message}</p>
              )}
              <div>
                <img src={isSender ? userData.avatar || assets.profile_img : selectedChat.avatar || assets.profile_img} alt="" />
                <p>{formatTime(msg.createAt)}</p>
                {isSender && (
                  <span className="message-status">
                    {msg.seen ? '✓✓' : msg.delivered ? '✓' : ''}
                  </span>
                )}
              </div>
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
            </div>
            <span>Uploading...</span>
          </div>
        )}
        <input 
          type="text" 
          ref={messagevalue} 
          placeholder='Type a message...'
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={isUploading}
        />
        <input
          type="file"
          id='file'
          onChange={handleFileUpload}
          ref={fileInputRef}
          hidden
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        />
        <label htmlFor="file" className={isUploading ? 'disabled' : ''}>
          <img src={assets.gallery_icon} alt="" style={{ opacity: isUploading ? 0.5 : 1 }} />
        </label>
        <img onClick={handleSend} src={assets.send_button} alt="" />
      </div>
    </div>
  )
}

export default RightSlide
 
