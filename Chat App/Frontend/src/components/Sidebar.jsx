import React, { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

function Sidebar() {

    const { selectedUser, setSelectedUser, getUsers, users, unSeenMessages, setUnSeenMessages } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState(false);

    const navigate = useNavigate();

    const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers();
    }, [onlineUsers]);

    return (
        <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'hidden md:block' : ''}`}>
            <div className='pb-5'>
                <div className='flex items-center justify-between'>
                    <img src={assets.logo} alt='logo' className='max-w-40' />
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="menu icon" className='cursor-pointer max-h-5' />
                        <div className='absolute right-0 z-20 w-32 p-5 rounded-md top-full bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
                            <p onClick={() => navigate(`/profile`)} className='text-sm cursor-pointer'>Edit Profile</p>
                            <hr className='my-2 border-t border-gray-500' />
                            <p onClick={logout} className='text-sm cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} alt="search icon" className='w-3' />
                    <input onChange={(e) => setInput(e.target.value)} type="text" className='text-xs text-white bg-transparent border-none outline-none placeholder:-[#c8c8c8] flex-1 ml-2' placeholder='Search User....' />
                </div>
            </div>
            <div className='flex flex-col'>
                {filteredUsers.length === 0 && (
                    <p className='px-4 py-6 text-sm text-center text-gray-400'>No users yet. Share the app link to start chatting!</p>
                )}
                {filteredUsers.map((user, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            setSelectedUser(user);
                            setUnSeenMessages(prev => ({ ...prev, [user._id]: 0 }));
                        }}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
                    >
                        <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />
                        <div className='flex flex-col leading-5'>
                            <p>{user.fullName}{user?.email === undefined && ''}</p>
                            {onlineUsers.includes(user._id)
                                ? <span className='text-xs text-green-400'>Online</span>
                                : <span className='text-xs text-neutral-400'>Offline</span>}
                        </div>
                        {unSeenMessages[user._id] > 0 && (
                            <p className='absolute flex items-center justify-center w-5 h-5 text-xs rounded-full top-4 right-4 bg-violet-500/50'>
                                {unSeenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
