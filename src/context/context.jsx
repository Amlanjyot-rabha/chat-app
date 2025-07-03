import { createContext, useState, useEffect } from "react";
import { doc, getDoc, onSnapshot, updateDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config/firebase";

export const appContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageId, setMessageId] = useState(null)
  const [userChats, setUserChats] = useState([])
  const [onlineUsers, setOnlineUsers] = useState({})

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const userData = userSnap.data()
        setUserData(userData)
        
        // Update last seen and online status
        await updateDoc(userRef, {
          lastSeen: Date.now(),
          online: true
        })

        // Set up interval for updating last seen
        const interval = setInterval(async () => {
          await updateDoc(userRef, {
            lastSeen: Date.now()
          })
        }, 60000)

        // Set offline status when user leaves
        window.addEventListener('beforeunload', async () => {
          await updateDoc(userRef, {
            online: false,
            lastSeen: Date.now()
          })
        })

        return () => {
          clearInterval(interval)
          window.removeEventListener('beforeunload')
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Load and subscribe to user's chats
  useEffect(() => {
    if (!userData?.id) return

    const chatRef = doc(db, 'chats', userData.id)
    const unsubscribe = onSnapshot(chatRef, async (docSnap) => {
      if (!docSnap.exists()) {
        await setDoc(chatRef, { chatData: [] })
        setUserChats([])
        return
      }

      try {
        const chatData = docSnap.data().chatData || []
        const chatPromises = chatData.map(async (chat) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', chat.rId))
            if (!userDoc.exists()) return null

            const userData = userDoc.data()
            setOnlineUsers(prev => ({
              ...prev,
              [chat.rId]: {
                online: userData.online || false,
                lastSeen: userData.lastSeen
              }
            }))

            // Get last message
            const messageDoc = await getDoc(doc(db, 'messages', chat.messageId))
            const messages = messageDoc.exists() ? messageDoc.data().messages : []
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null

            return {
              ...chat,
              user: userData,
              lastMessage: lastMessage?.message || chat.lastMessage || '',
              lastMessageTime: lastMessage?.createAt || chat.updatAt
            }
          } catch (error) {
            console.error("Error loading chat:", error)
            return null
          }
        })
        const resolvedChats = (await Promise.all(chatPromises))
          .filter(chat => chat !== null)
          .sort((a, b) => (b.lastMessageTime || b.updatAt) - (a.lastMessageTime || a.updatAt))

        setUserChats(resolvedChats)
      } catch (error) {
        console.error("Error loading chats:", error)
      }
    })

    return () => unsubscribe()
  }, [userData?.id])

  // Subscribe to current chat messages
  useEffect(() => {
    if (!messageId) {
      setMessages([])
      return
    }

    const unsubscribe = onSnapshot(doc(db, 'messages', messageId), (doc) => {
      if (!doc.exists()) {
        setMessages([])
        return
      }
      const messageData = doc.data()
      setMessages(messageData.messages || [])

      // Update message seen status
      if (selectedChat && userData) {
        updateMessageSeen(messageData.messages)
      }
    })

    return () => unsubscribe()
  }, [messageId, selectedChat, userData])

  // Update message seen status
  const updateMessageSeen = async (messages) => {
    if (!selectedChat || !userData || !messageId) return

    try {
      const chatRef = doc(db, 'chats', userData.id)
      const recipientChatRef = doc(db, 'chats', selectedChat.id)
      
      const chatDoc = await getDoc(chatRef)
      const recipientChatDoc = await getDoc(recipientChatRef)
      
      if (!chatDoc.exists() || !recipientChatDoc.exists()) return

      // Update current user's chat
      const chatData = chatDoc.data().chatData || []
      const updatedChatData = chatData.map(chat => 
        chat.messageId === messageId 
          ? { ...chat, messageSeen: true }
          : chat
      )
      await updateDoc(chatRef, { chatData: updatedChatData })

      // Update recipient's chat - mark messages as delivered
      const recipientChatData = recipientChatDoc.data().chatData || []
      const updatedRecipientChatData = recipientChatData.map(chat => 
        chat.messageId === messageId 
          ? { ...chat, messageDelivered: true }
          : chat
      )
      await updateDoc(recipientChatRef, { chatData: updatedRecipientChatData })

      // Update message document with seen status
      const messageRef = doc(db, 'messages', messageId)
      const updatedMessages = messages.map(msg => ({
        ...msg,
        seen: msg.sId !== userData.id ? true : msg.seen,
        delivered: true
      }))
      await updateDoc(messageRef, { messages: updatedMessages })
    } catch (error) {
      console.error("Error updating message status:", error)
    }
  }

  const value = {
    userData,
    setUserData,
    loadUserData,
    selectedChat,
    setSelectedChat,
    messages,
    setMessages,
    messageId,
    setMessageId,
    userChats,
    onlineUsers
  }

  return (
    <appContext.Provider value={value}>
      {props.children}
    </appContext.Provider>
  )
}

export default AppContextProvider