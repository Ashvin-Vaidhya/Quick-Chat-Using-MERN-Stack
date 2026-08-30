import React from 'react'
import { useState } from 'react'
import Sidebar from '../components/sidebar'
import ChatContainer from '../components/chatcontainer'
import RightSidebar from '../components/rightsidebar'

const Homepage = () => {

  const [selectedChat, setSelectedChat] = useState(false)

  return (
    <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl h-full w-full flex fixed ${selectedChat ? 'flex-row' : ''}`}>
      <Sidebar />
      <ChatContainer />
      <RightSidebar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
    </div>
  )
}

export default Homepage
