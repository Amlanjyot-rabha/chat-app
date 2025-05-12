import React, { useEffect, useState } from 'react'
import assets from "../../assets/assets.js"
import { onAuthStateChanged} from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {auth,db} from '../../firebase-config/firebase.js'
import './ProfileUpdate.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import upload from "../../lib/library.js"
 
const ProfileUpdate = () => {
  const [profileImage,setProfileImage]=useState(false)
  const [name,setName]=useState('')
  const [bio,setBio]=useState('')
  const [uid,setUid]=useState('')


  const navigate=useNavigate()
   useEffect(()=>{
      onAuthStateChanged(auth, async(user)=>{
         if(user){
          setUid(user.uid)
          const docRef= doc(db,'users',user.uid)
          const docSnp= await getDoc(docRef)
          if(docSnp.data().name){
            setName(docSnp.data().name)
          }
          if(docSnp.data().bio){
            setBio(docSnp.data().bio)
          }
         
          if(docSnp.data().avatar){
            setPreviousImage(docSnp.data().avatar)
          }
            
         }
         else{
          alert('not working ')
          navigate('/')
         
        }
      })
   },[])
      
   const updateProfile=async (event)=>{
      event.preventDefault()
      const docRef=doc(db,'users',uid)
      try {
        
        
        const imgurl = upload(profileImage)
        // setPreviousImage(imgurl)
        await updateDoc(docRef,{
          bio:bio,
          name:name,
          // avatar:imgurl
        })
        alert('updation completed')
        console.log(`name:${name},bio:${bio}`)
 

      } catch (error) {
        console.log('error in update profile');
        
      }
   }

  return (
    <form onSubmit={updateProfile}>
    <div className='container'>
      
      <div className='left'>
         
        <label htmlFor="image">
          <input type="file" onChange={(e)=>{setProfileImage(e.target.files[0])}} id='image'   hidden/>
          <img src={profileImage? URL.createObjectURL(profileImage):assets.avatar_icon} alt=""/>
        </label>
        <input onChange={(e)=>setName(e.target.value)} type="text"  value={name} placeholder='user name'/>
         <textarea onChange={(e)=>setBio(e.target.value)} value={bio} name="" id="" placeholder='bio..'></textarea>
         <button type='submit' style={{color:"black"}}>update</button>
      </div>
         
         <div className='right'>
         <img src={profileImage? URL.createObjectURL(profileImage):assets.avatar_icon} alt="" />
         </div>
       
    </div>
    
    </form>
  )
}

export default ProfileUpdate
