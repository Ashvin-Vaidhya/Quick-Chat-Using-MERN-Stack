import { useState, createContext, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext()


export const ChatProvider = ({children}) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({})

    const { socket, axios } = useContext(AuthContext) 


    const getUser = async () => {
      try {
        const { data } = await axios.get('/api/messages/users');
        if(data.success) {
              setUsers(data.users);
              setUnseenMessages(data.unSeenMessage);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }

// function to get messages for selected user
    
   const getMessages = async (userId) => {
     try {
        const { data } = await axios.get(`/api/messages/${userId}`);
        if(data.success) {
              setMessages((data.message));
        }
     } catch (error) {
        toast.error(error.message);
     }
   }

// function to send message to selected user

   const sendMessage = async (messageData) => {
     try {
        console.log(messageData)
        const { data } = await axios.post(`/api/messages/send/${selectedChat._id}`, messageData);
        if(data.success) {
            setMessages((prevMessages) => [...prevMessages, data.newMessage])
        }else{
            toast.error("err", data.message)
        }
     } catch (error) {
         console.log(error.message)
         toast.error(error.message);
     }
   }

// function to subscribe to messages for selected user

   const subscribeToMessages = async () => {
     if(!socket) return;
     socket.on("newMessage", (newMessage)=>{
       if(selectedChat && newMessage.senderId === selectedChat._id){
        setMessages((prevMessages) => [...prevMessages, newMessage])
        axios.get(`/api/messages/mark/${newMessage._id}`);
       }else{
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
        }))
       }
     })
   }

// function to unsubscribe from messages   
   
  const unSubscribeToMessages = async () => {
     if(socket) socket.off("newMessage")
  }

   useEffect(() => {
     subscribeToMessages();
     return () => {
    unSubscribeToMessages();
  };
   }, [socket, selectedChat])
   
   

    const value = {
       getUser,
       sendMessage,
       getMessages,
       messages,
       users,
       selectedChat,
       unseenMessages,
       setUnseenMessages,
       setSelectedChat
    }
    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}