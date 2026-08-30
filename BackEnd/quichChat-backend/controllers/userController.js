import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"


//Signup user
export const Signup = async (req, res) => {
   const {email, fullName, password, bio} = req.body
   try {
    if(!email || !fullName || !password || !bio){
        return res.json({success:false, message: "All fild are requre" })
    }
    const user = await User.findOne({email})
    if(user){
        return res.json({success:false, message: "User alredy exist do login" })
    }
     
    const salt = await bcrypt.genSalt(10);
    const hasdPassword = await bcrypt.hash(password, salt)

    const creatUser  = await User.create({
        email,
        fullName,
        password: hasdPassword,
        bio
    })

    const token = generateToken(creatUser._id)

    return res.json({success: true, userData: creatUser, token, message: "User created successfully"})

   } catch (error) {
    console.log(error.message)
     return res.json({success: false, message: error.message})
   }
}


//Login user
export const Login = async (req, res) => {
    try {
         const {email, password} = req.body
        const loginUser = await User.findOne({email})
        if(!loginUser) {
            return res.json({success: false, message: "no User found singUP first"}) 
        }

        const isPasswordCorrect = await bcrypt.compare(password, loginUser.password)
        if(!isPasswordCorrect){
             return res.json({success: false, message: "Soryy password did't match"}) 
        }

        const token = generateToken(loginUser._id)

         return res.json({success: true, userData: loginUser, token, message: "User login successfully"})
        
     } catch (error) {
        console.log(error.message)
     return res.json({success: false, message: error.message})
     }
}

export const chectAuth = (req, res) => {
  res.json({success: true, user: req.user})
}


export const updateProfile = async (req, res) => {
    try {
        
     const {profilePic, bio, fullName} = req.body 
     const userId = req.user._id;
     let updateUser;

     if(!profilePic){
        updateUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true})
     }else{
         const upload = await cloudinary.uploader.upload(profilePic)
 
         updateUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName}, {new: true})
     }
        
      return res.json({success: true, message: "User updated Successfully", user: updateUser})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }

}
