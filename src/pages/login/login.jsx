import "./login.css"
import assets from "../../assets/assets.js"
import { useState } from "react"
import {signup,login} from '../../firebase-config/firebase.js'
import { useEffect } from "react"
const Login=()=>{
   const [signIn,setSignIn]=useState('login')
   const [email,setEmail]=useState('')
   const [userName,setUserName]=useState("")
   const [password,setPassword]=useState('')

   const userHandeler=(event)=>{
      event.preventDefault();
      if(signIn==='signin'){
      signup(email,userName,password)
      console.log(email,userName,password)
      console.log(signIn)
   }else{
       login(email,password)
   } 
   }

   useEffect(()=>{
      console.log(signIn)

  },userHandeler)
   return(
    <>
   <div className="log-in-form">
      <div className="form-img">
         <img src={assets.log_in}/>
      </div>
      <div className="form-input">
         <h2>{signIn}</h2>
      <form className="form"  onSubmit={userHandeler} >
                {signIn==='login'?<></>:<input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder="user name.."/>}
                <input type="email" value={email}  onChange={(e)=>setEmail(e.target.value)} placeholder="email.."/>
                 <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="passwrod.."/>
            
             {signIn==="login"?
             <>
             <p>Don't have account</p>
             <span onClick={()=>setSignIn('signin')}>Login</span>
             </>:
              <>
              <p>Alredy have a account?</p>
              <span onClick={()=>setSignIn('login')}>Sign-in</span>
              </>}
            <button type="submit">{signIn}</button>
        </form>
      </div>
    
   </div>
    </>

   )
}
export default  Login