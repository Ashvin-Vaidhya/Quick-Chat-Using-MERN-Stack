import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
  const { logout, onlineUsers } = useContext(AuthContext)
  const { users, getUser, selectedChat, setSelectedChat, unseenMessages, setUnseenMessages } = useContext(ChatContext)

  const [input, setInput] = useState(false)

  const filterdUser = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users

  useEffect(() => {
    getUser();
  }, [onlineUsers])
  
  const navigate = useNavigate();
  return (<>
    <div className={`h-full ${selectedChat ? "w-1/4" : "w-2/4"} ${selectedChat ? "hidden lg:block" : "block w-full"} bg-[#8185B2]/10 rounded-2xl py-4 px-3.5 shadow-lg relative flex flex-col`}>
    <div className="pb-3">
      <div className="w-full  flex items-center justify-between pb-5">
        <img src={assets.logo} alt="logo" className='max-w-40' />
        <div className="relative py-2 group">
          <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
          <div className='absolute top-full right-0 w-32 p-5 z-20 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
            <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
            <hr className="my-2 border-t border-gray-500" />
            <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 bg-[#282142] rounded-2xl px-4 py-2">
        <img src={assets.search_icon} alt="Search" className='w-3'/>
        <input type="text" onChange={(e) =>setInput(e.target.value)} className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1' placeholder="Search User.."/>
      </div>
    </div>

        <div className="last w-full h-full overflow-y-scroll">
           { filterdUser.map((user, index) => (
            <div 
              key={index} 
              className={`flex items-center relative justify-between gap-3 p-3 rounded-lg cursor-pointer hover:bg-[#282142]/50 ${selectedChat?._id === user._id ? "bg-[#282142]/70" : ""}`}
              onClick={() => {setSelectedChat(user), setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }) )}}
            >
            <div className="flex items-center gap-3">
              <img src={user.profilePic ? user.profilePic : assets.avatar_icon} alt={user.name} className='w-10 h-10 object-cover rounded-full' />
              <div className="flex flex-col">
                <p className="text-white text-sm font-semibold">{user.fullName}</p>
                {
                    onlineUsers.includes(user._id) 
                    ?<span className="text-green-500 text-xs">Online</span>
                    :<span className="text-gray-400 text-xs">Offline</span>
                }
              </div>
            </div>

           {unseenMessages[user._id] > 0 && <div className="w-3 h-3 rounded-full p-2.5 bg-[#8185B2] text-amber-50 flex items-center justify-center">
                {unseenMessages[user._id]}
            </div>}

            </div>
           ))}
        </div>
    </div>
      {!selectedChat && (
        <div className="bottom-0 hidden lg:block left-0 w-full h-full p-4 bg-[#282142]/50 rounded-b-2xl text-center text-gray-400">
          <div className=" flex flex-col justify-center items-center w-full h-full">
            <img className="w-20" src={assets.logo_icon} alt="hi" />
            <p className="text-lg">Select a chat for messaging</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
