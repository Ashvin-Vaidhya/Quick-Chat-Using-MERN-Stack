import express from "express"
import { chectAuth, Login, Signup, updateProfile } from "../controllers/userController.js"
import { protectRoute } from "../middleware/auth.js"


const userRouter = express.Router()

userRouter.post('/signup', Signup)
userRouter.post('/login', Login)
userRouter.post('/update-profile', protectRoute, updateProfile)
userRouter.get('/check', protectRoute, chectAuth)

export default userRouter;