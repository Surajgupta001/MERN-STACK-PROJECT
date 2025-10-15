import React from 'react'
import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Messages() {

  const { connections } = useSelector((state) => state.connections);
  const navigate = useNavigate();

  return (
    <div className='relative min-h-screen bg-slate-50'>
      <div className='max-w-6xl p-6 mx-auto'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Messages</h1>
          <p className='text-slate-600'>Talk to your friend and family</p>
        </div>
        {/* Connected Users */}
        <div className='flex flex-col gap-3'>
          {connections.map((user) => (
            <div key={user._id} className='flex flex-wrap max-w-xl gap-5 p-6 bg-white rounded-md shadow'>
              <img src={user.profile_picture} alt="" className='mx-auto rounded-full size-12' />
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-slate-600'>{user.bio}</p>
              </div>
              <div className='flex flex-col gap-2 mt-4'>
                <button onClick={() => navigate(`/messages/${user._id}`)} className='flex items-center justify-center gap-1 text-sm transition rounded cursor-pointer size-10 bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95'>
                  <MessageSquare className='w-4 h-4' />
                </button>
                <button onClick={() => navigate(`/profile/${user._id}`)} className='flex items-center justify-center text-sm transition rounded cursor-pointer size-10 bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95'>
                  <Eye className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Messages
