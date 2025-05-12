import React, { useContext, useEffect, useState } from 'react'
import './leftslide.css'
import assest from '../../assets/assets.js'
import { signout } from '../../firebase-config/firebase.js'
import { useNavigate } from 'react-router-dom'
import { collection, query, where,getDocs, serverTimestamp, updateDoc, arrayUnion} from 'firebase/firestore'
import { db } from '../../firebase-config/firebase.js'
import { useRef } from 'react'
import { appContext } from '../../context/context.jsx'
 
const LeftSlide= () => {
     const inputvalue=useRef()
        const {userData}=useContext(appContext)
        const [user,setUser]=useState(null)
        const [showSearch,setshowSearch]=useState(false)
        const inputHandeler=async ()=>{
      
   try {
        const inputValue=inputvalue.current.value
        if(inputValue){
          setshowSearch(true)
          const userRef= collection(db,'users')
          const q=query(userRef,where("userName","==",inputValue.toLowerCase()))        
          const userSnp= await getDocs(q)

             if(!userSnp.empty && userSnp.docs[0].data().id !== userData.id){
                setUser(userSnp.docs[0].data())
              }
              else{
                setUser(null)
               }
        }

            
      else{
        setshowSearch(false)
      }

    }
     catch (error) {
      console.log('error in left')
    }
  }
      
  const  navigate=useNavigate()
  const editProfile=()=>{
       navigate('/updateprofile')
  }


  const addChat=async()=>{
   const messageRef=collection(db,'messages')
   const chatsRef=collection(db,'chats')
   
   const newMessagesRef=doc(messageRef)

   await setDoc(newMessagesRef,{
    createAt:serverTimestamp(),
    messages:[]
   })

   await updateDoc(doc(chatsRef,user.id,{
    chatsData:arrayUnion({
      messageId:newMessagesRef.id,
      lastMessage:"",
      rId:userData.id,
      updatAt:Date.now(),
      messageSeen:true
    })
   }))

   await updateDoc(doc(chatsRef,userData.id,{
    chatsData:arrayUnion({
      messageId:newMessagesRef.id,
      lastMessage:"",
      rId:user.id,
      updatAt:Date.now(),
      messageSeen:true
    })
   }))

  }

  return (
    <div className="wrapper">
      
 
          <div className="left-nav-top">
            <div className="logo"><img src={assest.logo} alt="" /></div>
            <div className="menu"> <img src={assest.menu_icon} alt="" /></div>
            <div className='menu-items'><p onClick={()=>{editProfile()}}>Edit profile</p> <br /> <hr /><p onClick={()=>signout()}>logout</p></div>
          </div> 

          <div className="left-search">
            <img src={assest.search_icon} alt="" onClick={inputHandeler} />
            <input   ref={inputvalue}  type="text" placeholder='Search' />
          </div>

          <div className="left-contacts">
            {showSearch && user?
             <div className='contact-list'> 
              <img src={assest.profile_img} alt="" />
                    <div style={{color:'white'}}>
                         <h4>{user.userName}</h4>
                        <span>stuff?</span>
                     </div>
            </div>:
                Array(50).fill('').map((item,index)=>(
                  <div className="contact-list" key={index} onClick={addChat}>
                  <img src={assest.profile_img} alt="" />
                    <div style={{color:'white'}}>
                         <h4>usename</h4>
                        <span>stuff?</span>
                     </div>
                </div>
                ))
               }
            
           
          </div>

     
    </div>
  )
}

export default LeftSlide
