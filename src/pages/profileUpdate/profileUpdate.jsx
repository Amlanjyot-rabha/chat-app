import React, { useEffect, useState } from 'react'
import assets from "../../assets/assets.js"
import { onAuthStateChanged} from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {auth,db} from '../../firebase-config/firebase.js'
import './ProfileUpdate.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from "../../lib/uploadService.js"
 
const ProfileUpdate = () => {
  const [profileImage,setProfileImage]=useState(null)
  const [name,setName]=useState('')
  const [bio,setBio]=useState('')
  const [uid,setUid]=useState('')
  const [previousImage,setPreviousImage]=useState('')
  const [isUploading, setIsUploading] = useState(false)

  const navigate=useNavigate()
   useEffect(()=>{
      onAuthStateChanged(auth, async(user)=>{
         if(user){
          setUid(user.uid)
          const docRef= doc(db,'users',user.uid)
          const docSnp= await getDoc(docRef)
          if(docSnp.exists()){
            const userData = docSnp.data()
            if(userData.name){
              setName(userData.name)
            }
            if(userData.bio){
              setBio(userData.bio)
            }
            if(userData.avatar){
              setPreviousImage(userData.avatar)
            }
          }
         }
         else{
          toast.error('Authentication failed')
          navigate('/')
         }
      })
   },[])
      
   const updateProfile=async (event)=>{
      event.preventDefault()
      if(!uid) return
      
      setIsUploading(true)
      const docRef=doc(db,'users',uid)
      try {
        let avatarUrl = previousImage
        
        if(profileImage){
          try {
            const uploadResult = await upload(profileImage, `profile_${uid}`)
            avatarUrl = uploadResult.fileUrl
            toast.success('Image uploaded successfully!')
          } catch (error) {
            console.error('Error uploading image:', error)
            toast.error(error.message || 'Failed to upload image')
            setIsUploading(false)
            return
          }
        }
        
        await updateDoc(docRef,{
          bio: bio,
          name: name,
          avatar: avatarUrl
        })
        
        toast.success('Profile updated successfully!')
        navigate('/chat')
      } catch (error) {
        console.error('Error in update profile:', error)
        toast.error('Failed to update profile')
      } finally {
        setIsUploading(false)
      }
   }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit for profile images
        toast.error('Image size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      setProfileImage(file)
    }
  }

  return (
    <div className='profile-update-container'>
      <form onSubmit={updateProfile}>
        <div className='container'>
          <div className='left'>
            <h2>Edit Profile</h2>
            <label htmlFor="image" className="image-upload-label">
              <input 
                type="file" 
                onChange={handleImageChange} 
                id='image' 
                accept="image/*"
                hidden
              />
              <div className="image-preview">
                <img 
                  src={profileImage ? URL.createObjectURL(profileImage) : (previousImage || assets.avatar_icon)} 
                  alt="Profile"
                />
                <div className="image-overlay">
                  <span>Change Photo</span>
                </div>
              </div>
            </label>
            <input 
              onChange={(e)=>setName(e.target.value)} 
              type="text"  
              value={name} 
              placeholder='Enter your name'
              required
            />
            <textarea 
              onChange={(e)=>setBio(e.target.value)} 
              value={bio} 
              placeholder='Write something about yourself...'
              rows="4"
            />
            <button type='submit' disabled={isUploading}>
              {isUploading ? 'Updating...' : 'Update Profile'}
            </button>
            <button type='button' onClick={() => navigate('/chat')} className="cancel-btn">
              Cancel
            </button>
          </div>
           
          <div className='right'>
            <h3>Preview</h3>
            <div className="preview-card">
              <img 
                src={profileImage ? URL.createObjectURL(profileImage) : (previousImage || assets.avatar_icon)} 
                alt="Profile Preview" 
              />
              <h4>{name || 'Your Name'}</h4>
              <p>{bio || 'Your bio will appear here...'}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileUpdate
