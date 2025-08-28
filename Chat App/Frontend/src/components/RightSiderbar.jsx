import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

function RightSiderbar() {

    const { selectedUser, messages } = useContext(ChatContext);
    const { logout, onlineUsers } = useContext(AuthContext);
    const [msgImages, setMsgImages] = useState([]);

    // Get all the images from the messages and set them to state
    useEffect(() => {
        setMsgImages(
            messages.filter((msg) => msg.image).map((msg) => msg.image)
        )
    },[messages]);
    
    return selectedUser && (
        <div className={`bg-[#8185b2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
            <div className='flex flex-col items-center gap-2 pt-16 mx-auto text-xs font-light'>
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
                <h1 className='flex items-center gap-2 px-10 mx-auto text-xl font-medium'>
                    {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 bg-green-500 rounded-full'></p>}
                    {selectedUser.fullName}
                </h1>
                <p className='px-10 mx-auto'>{selectedUser.bio}</p>
            </div>
            <hr className='border-[#ffffff50] my-4'/>
            <div className='px-5 text-xs'>
                <p>Media</p>
                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImages.map((url, index) => (
                        <div key={index} onClick={() => window.open(url)} className='rounded cursor-pointer'>
                            <img src={url} alt="" className='h-full rounded-md' />
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => logout()} className='absolute px-20 py-2 text-sm font-light text-white transform -translate-x-1/2 border-none rounded-full cursor-pointer bottom-5 left-1/2 bg-gradient-to-r from-purple-400 to-violet-600'>Logout</button>
        </div>
    )
}

export default RightSiderbar
