import React from 'react'
import './rightslide.css'
import assets from '../../assets/assets'
const RightSlide = () => {
  return (
   <div className="chat-box">

     <div className="chat-user">
       <img src={assets.profile_img} alt="" className='profile'/>
       <p>usename<img src={assets.green_dot}  className="greendot" alt="" /> </p>
       <img src={assets.help_icon} className='help' alt="" />
     </div>

     <div className="chat-msg">
         <div className="s-msg">
          <p className='msg'>Lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, et! Accusantium fugit nulla nemo ullam nostrum, architecto impedit blanditiis beatae! dolor sit amet consectetur adipisicing elit. Perferendis, excepturi.</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>1:20PM</p>
          </div>
         </div>


         <div className="r-msg">
          <p className='msg'>Lorem ipsum dolor sit amet consectetur adipisicing elit.   Perferendis, excepturi.</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>1:20PM</p>
          </div>
         </div>
         <div className="s-msg">
          <img className="sending-image" src={assets.profile_img} alt="" />
          <div>
            <img src={assets.profile_img} alt="" />
            <p>1:20PM</p>
          </div>
         </div>


         <div className="r-msg">
          <p className='msg'>Lorem ipsum dolor sit amet consectetur adipisicing elit.   Perferendis, excepturi.</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>1:20PM</p>
          </div>
         </div>
     </div>

     <div className="chat-input">
       <input type="text" placeholder='type..'/>
       <input type="file" id='image' accept='image/png, image/jpeg' hidden/>
       <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" />
       </label>
       <img src={assets.send_button} alt="" />
     </div>

   </div>
  )
}

export default RightSlide
