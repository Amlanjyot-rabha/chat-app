import { createContext, useState } from "react";
import { doc,getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import {auth, db } from "../firebase-config/firebase";
import { useEffect } from "react";
export const appContext=createContext();
const AppContextProvider=(props)=>{
    const [chatData,setChatData]=useState(null)
    const [userData,setUserData]=useState(null)
 
     const loadUserData=async (uid)=>{
         
        

        try {
            const userRef= doc(db,'chats',uid) 
            const userSnap=await getDoc(userRef)
            const userData=userSnap.data()
            setUserData(userData)

            await updateDoc(userRef,{
                lastSeen:Date.now()
            })

                setInterval(async() => {
                    await updateDoc(userRef,{
                        lastSeen:Date.now()
                    })
             
                }, 6000);
       useEffect(()=>{
        if(userData){   
            const chatSnp= doc(db,'chats',userData.id) 
            const onsub= onSnapshot(chatSnp,async (res)=>{
            const chatItem=res.data().chatData
            const temArray=[]
            for(let item of chatItem){
               const userRef=doc(db,'users',item.rId)
               const userSnp=getDoc(userRef)
               const userData=await userSnp.data()
               temArray.push({...item,userData})
            }
             
            // setChatData(temArray.sort((a,b)=>a.updateAt-b.updateAt))
            setChatData(temArray)

          })
       }
       else{
           console.log('error in con')
       }
         
       },[userData])
          
        
        
    

            
         
        } catch (error) {
            console.log('error in context');
            
        }
     }

    const value={
        chatData,setChatData,
        userData,setUserData,
        loadUserData
    }
    return(
        <appContext.Provider value={value}>
              {props.children}
        </appContext.Provider>
    )
    
}
export default AppContextProvider