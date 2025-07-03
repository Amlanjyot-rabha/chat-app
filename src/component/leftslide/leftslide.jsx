import React, { useContext, useState, useRef,useEffect } from 'react'
import './leftslide.css'
import assest from '../../assets/assets.js'
import { signout } from '../../firebase-config/firebase.js'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, serverTimestamp, updateDoc, arrayUnion, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase-config/firebase.js'
import { appContext } from '../../context/context.jsx'

const LeftSlide = () => {
  const inputvalue = useRef()
  const { userData, setMessageId, setSelectedChat, userChats } = useContext(appContext)
  const [user, setUser] = useState(null)
  const [showSearch, setshowSearch] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const [contactList,setContactList]=useState([])
  const [showMenu, setShowMenu] = useState(false)

  const inputHandeler = async () => {
     
    
    try {
      const inputValue = inputvalue.current.value.trim().toLowerCase()
      
      if (inputValue) {
        setshowSearch(true)
        const userRef = collection(db, 'users')
        const q = query(userRef, where("userName", "==", inputValue))        
        const userSnp = await getDocs(q)
        if (!userSnp.empty && userSnp.docs[0].data().id !== userData?.id) {
          setUser(userSnp.docs[0].data())
        } else {
          setUser(null)
        }
      } else {
        setshowSearch(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Error searching user:", error)
    }
  }

  const navigate = useNavigate()
  
  const editProfile = () => {
    setShowMenu(false)
    navigate('/updateprofile')
  }
 
  const addChat = async () => {
    if (!user || !userData || isCreatingChat) return
    
    try {
      setIsCreatingChat(true)

      // Check if chat already exists
      const existingChat = userChats.find(chat => chat.user?.id === user.id)
      if (existingChat) {
        setMessageId(existingChat.messageId)
        setSelectedChat(existingChat.user)
        setshowSearch(false)
        inputvalue.current.value = ''
        return
      }
      else{
        console.log("chat not found")
      }

      // Create new message document
      const messageRef = doc(collection(db, 'messages'))
      await setDoc(messageRef, {
        createAt: serverTimestamp(),
        messages: []
      })

      const chatData = {
        messageId: messageRef.id,
        lastMessage: "",
        updatAt: Date.now(),
        messageSeen: true
      }
    
      // Update current user's chat document
      const userChatRef = doc(db, 'chats', userData.id)
      const userChatDoc = await getDoc(userChatRef)
      
      if (!userChatDoc.exists()) {
        await setDoc(userChatRef, { chatData: [] })
      }
      
      await updateDoc(userChatRef, {
        chatData: arrayUnion({
          ...chatData,
          rId: user.id
        })
      })

      // Update recipient's chat document
      const recipientChatRef = doc(db, 'chats', user.id)
      const recipientChatDoc = await getDoc(recipientChatRef)
      
      if (!recipientChatDoc.exists()) {
        await setDoc(recipientChatRef, { chatData: [] })
      }
      
      await updateDoc(recipientChatRef, {
        chatData: arrayUnion({
          ...chatData,
          rId: userData.id,
          messageSeen: false
        })
      })

      setMessageId(messageRef.id)
      setSelectedChat(user)
      setshowSearch(false)
      inputvalue.current.value = ''
    } catch (error) {
      console.error('Error creating chat:', error)
    } finally {
      setIsCreatingChat(false)
    }
  }

  const selectChat = (chat) => {
    if (!chat?.messageId || !chat?.user) return
    setMessageId(chat.messageId)
    setSelectedChat(chat.user)
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleLogout = () => {
    setShowMenu(false)
    signout()
  }
  
 
  
   
  
    useEffect(() => {
      const fetchContacts = async () => {
        try {
          const userReff = collection(db, 'users');
          const userSnp = await getDocs(userReff);
          const newContacts = userSnp.docs.map((doc) => doc.data());  
          setContactList(prevContacts => [...prevContacts, ...newContacts]);   
           
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      };
  
      fetchContacts();
        
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (showMenu && !event.target.closest('.menu') && !event.target.closest('.menu-items')) {
          setShowMenu(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [showMenu])
  
 const  [setting,setSetting]=useState(false)
 const display=()=>{
   if(setting){
    setSetting(false)
   }
   else{
    setSetting(true)
   }
 }
 

  return (
    <div className="wrapper">
      <div className="left-nav-top">
        <div className="logo">
          <img src={assest.logo} alt="" />
          <span className="user-name">{userData?.name || userData?.userName}</span>
        </div>
        {/* <button className="menu"> */}
          <img src={assest.menu_icon} alt=""  onClick={display}/>
        {/* </button> */}
        {
          setting?<div className='setting'>
          <p onClick={editProfile}>Edit profile</p><br />
          <p onClick={handleLogout}>Logout</p>
        </div>:" "
        }
         
      </div> 

      <div className="left-search">
        <img src={assest.search_icon} alt="" onClick={inputHandeler} />
        <input 
          ref={inputvalue} 
          type="text" 
          placeholder='Search users...' 
          onChange={inputHandeler}
          onKeyPress={(e) => e.key === 'Enter' && user && addChat()}
        />
      </div>

      <div className="left-contacts">
        {showSearch && user ? (
          <div className='contact-list' onClick={addChat}> 
            <img src={user.avatar || assest.profile_img} alt="" />
            <div style={{color:'white'}}>
              <h4>{user.userName}</h4>
              <span>{user.bio || 'Hey there!'}</span>
            </div>
          </div>
        ) : (
          userChats.map((chat) => (
            <div 
              className={`contact-list`} 
              key={chat.messageId} 
              onClick={() => selectChat(chat)}
            >
              <img src={chat.user?.avatar || assest.profile_img} alt="" />
              <div style={{color:'white'}}>
                <h4>{chat.user?.userName}</h4>
                <span>{chat.lastMessage || 'Start chatting!'}</span>
                {!chat.messageSeen && <span className="unread-indicator">●</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
 
export default LeftSlide

  
 
