import React, { useContext, useState, useEffect } from 'react'
import assets  from "../assets/assets";
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const Rightsidebar = () => {
  const {selectedChat, messages} = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([]);

  // Filter messages to get images
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  },[messages])

if ( !selectedChat) return null;
  return (
    <div className={`h-full w-1/4 ${selectedChat ? 'block': 'hidden'} ${selectedChat ? "hidden lg:block" : "block"} bg-[#8185B2]/10 rounded-2xl relative overflow-hidden shadow-lg`}>
      <div className='w-full h-[40vh] flex flex-col items-center justify-end text-gray-300 pb-6 px-4'>
        <img className='w-[100px] rounded-full' src={selectedChat?.profilePic || assets.avatar_icon} alt="" />
        <div className='flex items-center justify-center gap-2'>{onlineUsers.includes(selectedChat._id) && <p className='h-2 w-2 bg-green-500 rounded-full'></p>}<p className='text-2xl font-semibold'>{selectedChat.fullName}</p></div>
        <p className='text-sm text-center pb-4'>{selectedChat.bio}</p>
        <div className='h-[0.5px] w-full bg-gray-500 absolute'></div>
      </div>
      <div className='w-full h-[60vh] flex flex-col  items-end justify-center text-gray-400 pb-4 px-8'>
        <div className='h-full w-full overflow-hidden mb-3'>
          <p className='w-full text-center'>Media</p>
          {msgImages.length > 0 ? <div className='flex justify-center flex-wrap w-full h-full gap-2 mt-1 pb-8 overflow-y-scroll'>
                {msgImages.map((url, index) => (
                  <div className='w-[100px] h-[100px]' key={index} onClick={()=>{window.open(url)}}>
                    <img src={url} alt={`media-${index}`} className='w-full h-full object-cover rounded-lg cursor-pointer' />
                  </div>
                ))}
          </div> : <p className='text-center my-40 text-gray-600'>No media found</p>}
        </div>
        <button type="button" onClick={() => logout()} className="text-white w-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-700 hover:bg-gradient-to-br cursor-pointer rounded-full text-sm px-5 py-2.5 text-center">Logout</button>
      </div>
    </div>
  )
}

export default Rightsidebar
