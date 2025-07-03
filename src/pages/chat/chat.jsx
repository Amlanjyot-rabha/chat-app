import React, { useState, useContext } from 'react'
import './chat.css'
import LeftSlide from '../../component/leftslide/leftslide'
import RightSlide from '../../component/rightslide/rightslide'
import { appContext } from '../../context/context'

const Chat = () => {
  const { selectedChat } = useContext(appContext)
  const [isMobileChat, setIsMobileChat] = useState(false)

  // Toggle mobile chat view when a chat is selected
  React.useEffect(() => {
    if (selectedChat) {
      setIsMobileChat(true)
    }
  }, [selectedChat])

  const handleBackToList = () => {
    setIsMobileChat(false)
  }

  return (
    <div className="chat-container">
      <div className={`wrapper ${isMobileChat ? 'chat-open' : ''}`}>
        <LeftSlide />
      </div>
      <div className={`chat-box ${isMobileChat ? 'active' : ''}`}>
        <RightSlide onBack={handleBackToList} />
      </div>
    </div>
  )
}

export default Chat
