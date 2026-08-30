import assets from "../assets/assets";
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext)

  const navigate = useNavigate()
  const [SelectedImg, setSelectedImg] = useState()
  const [fullName, setFullName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const HandelSubmit = async (e) => {
    e.preventDefault();
    if(!SelectedImg){
      await updateProfile({fullName, bio})
      navigate("/profile")
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(SelectedImg);
    reader.onload = async () => {
      const base64Image = reader.result
      await updateProfile({profilePic: base64Image, fullName, bio})
      setSelectedImg()
    }
    return;
  }

  return (
    <div className='min-h-screen sm:min-h-[450px] w-full sm:w-[640px] gap-6 sm:gap-0 rounded-2xl border-[1.5px] border-gray-400 backdrop-blur-2xl flex sm:flex-row flex-col-reverse items-center absolute justify-end py-25 sm:py-5 px-7'>
       
        <form onSubmit={HandelSubmit} className="w-full space-y-5 text-white">
          <h2 className="text-2xl font-semibold">Profile details</h2>

          <div className="flex items-center gap-3">
          <div className='w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] relative rounded-full overflow-hidden'>
            <input type="file" id='image'  onChange={(e)=>setSelectedImg(e.target.files[0])} accept='image/jpeg, image/png' hidden/>
            <label htmlFor="image"><img className='object-cover cursor-pointer' src={SelectedImg ? URL.createObjectURL(SelectedImg) : assets.avatar_icon} alt="Gallery_pic" /></label>
          </div>
          <p>Upload profile picture</p>
          </div>

          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            placeholder="Your Name"
            className="w-full bg-black/30 border border-gray-500 rounded-md p-2 placeholder-gray-500  placeholder:text-[16px] placeholder:font-semibold text-white"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Your bio..."
            className="w-full min-h-28 bg-black/30 border border-gray-500 rounded-md p-2  placeholder-gray-500  placeholder:text-[16px] placeholder:font-semibold text-white"
          />

          <button type='submit' className="w-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-700 cursor-pointer text-white py-2 rounded-full font-semibold hover:opacity-90 transition">
            Save
          </button>
        </form>

        {/* Right Section - Chat Icon */}
        <div className="flex w-full items-center justify-center">
       <img className='w-35 h-35 sm:w-45 sm:h-45 object-cover rounded-full' src={authUser?.profilePic || assets.logo_icon} alt="logo" />
       {/* {authUser.profilePic && <img className='w-30 h-30 sm:w-45 sm:h-45 object-cover rounded-full' src={authUser.profilePic} alt="profile pic" />} */}
        </div>
    </div>
  )
}

export default ProfilePage
