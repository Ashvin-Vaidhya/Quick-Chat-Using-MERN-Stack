import React, { useContext, useState } from "react";
import { useRef, useEffect } from "react";
import { formatMessageTime } from "../lib/utils";
import assets  from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ChatContext } from "../../context/ChatContext";

const Chatcontainer = () => {
  const { messages, selectedChat, setSelectedChat, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const scrollEnd = useRef(null);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [input, setInput] = useState("");

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
    };
    reader.readAsDataURL(file)
  };

    useEffect(()=>{
    if(selectedChat) { 
      getMessages(selectedChat._id)
    }
    }, [selectedChat])

    // Don't render if required data isn't available
  if (!authUser || !selectedChat) return null;

  return (
    <>
      {/* top area */}
      <div
        className={`main h-full w-2/4 p-4 rounded-lg flex flex-col relative ${
          selectedChat ? "w-full lg:w-2/4" : "w-2/4 hidden"
        }`}
      >
        <div className="Top w-full flex items-center gap-2 relative pb-3">
          <img
            className="w-9 rounded-full"
            src={selectedChat.profilePic || assets.avatar_icon}
            alt="ProfilePic"
          />
          <p className="text-white">{selectedChat.fullName}</p>
          {onlineUsers.includes(selectedChat._id) ? <span className="h-2 w-2 bg-green-500 rounded-full"></span> : null}
          <img
            className="absolute block lg:hidden right-0 w-5 cursor-pointer"
            onClick={() => setSelectedChat(false)}
            src={assets.arrow_icon}
            alt="Menu"
          />
          <img
            className="absolute hidden lg:block right-0 w-5 cursor-pointer"
            src={assets.help_icon}
            alt="Menu"
          />
        </div>
        <div className="h-[0.5px] w-full bg-gray-500"></div>

        {/* middle area */}
        <div className="flex flex-col flex-1 h-full w-full overflow-y-scroll gap-4 py-3.5">
          {messages.map((msg, index) => (
            <div
              className={`flex items-end gap-2 justify-end ${
                msg.senderId !== authUser._id &&
                "flex-row-reverse"
              }`}
              key={index}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  className="min-w-[240px] border border-gray-300 rounded-2xl overflow-hidden mb-3"
                />
              ) : (
                <p
                  className={` p-2 max-w-[200px] md:text-sm font-light rounded-xl mb-8 break-all bg-violet-800/60 text-white ${
                    msg.senderId === authUser._id
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-xs flex flex-col items-center justify-center gap-1.5 text-center">
                <img
                  className="w-[40px] rounded-full"
                  src={
                    msg.senderId === authUser._id ? authUser.profilePic || assets.avatar_icon
                      : selectedChat.profilePic || assets.avatar_icon
                  }
                  alt="profilePic"
                />
                <p className="text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={scrollEnd}></div>
        </div>

        {/* bottom area */}
        <div className="w-full h-11 flex gap-3 mt-3">
          <div className="flex items-center h-full w-full justify-between gap-2 bg-[#434344]/45 rounded-full pl-7 pr-5 py-2">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) =>
                e.key == "Enter" ? handleSendMessage(e) : null
              }
              placeholder="Send a message"
              className="bg-transparent border-none outline-none text-white text-[15px] placeholder-gray-400 flex-1"
            />
            <input
              type="file"
              onChange={handleSendImage}
              id="image"
              accept="image/jpeg, image/png"
              hidden
            />
            <label htmlFor="image">
              <img
                className="w-5 cursor-pointer"
                src={assets.gallery_icon}
                alt="Gallery_pic"
              />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            className="w-10  cursor-pointer"
            src={assets.send_button}
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Chatcontainer;
