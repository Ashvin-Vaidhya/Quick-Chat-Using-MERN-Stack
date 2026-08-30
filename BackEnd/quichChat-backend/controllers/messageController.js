import Message from "../models/message.js"
import User from "../models/User.js"
import cloudinary from "../lib/cloudinary.js"
import { io, userSocketMap } from "../index.js"

//get all user for side bar
export const getUserForSideBar = async (req, res) => {
   try {
    const UserId = req.user._id
    const filterdUser = await User.find({_id: {$ne: UserId}}).select("-password")

   let unSeenMessage = {}
    const promises = filterdUser.map( async (user) => {
       const messages = await Message.find({senderId: user._id, receiverId: UserId, seen: false})
       if(messages.length > 0){
           unSeenMessage[UserId._id] = messages.length
       }
    })
    await Promise.all(promises)
    return res.json({success: true, users: filterdUser, unSeenMessage })
   } catch (error) {
    console.log(error.Message)
    return res.json({success: false, messages: error.Message })
   }
}

//get All message of selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selecteedUserId } = req.params;
    const myId = req.user._id;
    const message = await Message.find({
        $or: [
            {senderId: myId, receiverId: selecteedUserId},
            {senderId: selecteedUserId, receiverId: myId}
        ]
    })

    await Message.updateMany({senderId: selecteedUserId, receiverId: myId}, {seen: true})

    return res.json({success: true, message})
  } catch (error) {
    console.log(error.Message)
    return res.json({success: false, messages: error.Message })
  }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.perams;
    await Message.findByIdAndUpdate(id, {seen: true})
    return res.json({success: true})
  } catch (error) {
     console.log(error.Message)
    return res.json({success: false, messages: error.Message })
  }
}


// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imaageUrl;
    if(image){
      const upload = await cloudinary.uploader.upload(image);
       imaageUrl = upload.secure_url;
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imaageUrl
    })

    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.json({success: true, newMessage})
    
    } catch (error) {
    return res.json({success: false, messages: error.message })
    }
}
