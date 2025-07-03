import react, { useEffect } from 'react'
import './App.css'
import {Route,Routes} from 'react-router-dom'
import Login from './pages/login/login.jsx'
import Chat from "./pages/chat/chat.jsx"
import Profile from './pages/profileUpdate/profileUpdate.jsx'
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth'
import {auth} from './firebase-config/firebase.js'
import { useNavigate} from 'react-router-dom'
import {appContext} from './context/context.jsx'
import { useContext } from 'react'
import ProfileUpdate from './pages/profileUpdate/profileUpdate.jsx'
 
 
 
const  App=()=>{
  const navigate=useNavigate()
 const {chatData,loadUserData}=useContext(appContext)
  useEffect(()=>{
     onAuthStateChanged(auth,async (user)=>{
      if (user) {
        await loadUserData(user.uid)
        navigate('/chat')
          
      } else {
        navigate('/')
      }

     } )
  },[])
   return(
    <>
            <ToastContainer />
            <Routes>
              <Route path={'/'} element={<Login/>}/>
              <Route path='/chat' element={<Chat/>}/>
              <Route path={'/profile'} element={<Profile/>}/>
              <Route path={'/updateprofile'} element={<ProfileUpdate/>}/>
            </Routes>
    </>
   )
    
}

export default App
// height:calc(100%-70px)