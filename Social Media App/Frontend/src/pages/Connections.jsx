import React, { useState } from 'react'
import { Users, UserPlus, UserCheck, UserRoundPen, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  dummyConnectionsData as connections,
  dummyFollowersData as followers,
  dummyFollowingData as following,
  dummyPendingConnectionsData as pendingConnections
} from '../assets/assets';

function Connections() {

  const [currentTabs, setCurrentTabs] = useState('Followers');

  const navigate = useNavigate();

  const dataArray = [{
    label: 'Followers',
    value: followers,
    icon: Users
  }, {
    label: 'Following',
    value: following,
    icon: UserCheck
  }, {
    label: 'Pending',
    value: pendingConnections,
    icon: UserRoundPen
  }, {
    label: 'Connections',
    value: connections,
    icon: UserPlus
  }
  ];

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl p-6 mx-auto'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Connections</h1>
          <p className='text-slate-600'>Manage your network and discover new connections</p>
        </div>
        {/* Count */}
        <div className='flex flex-wrap gap-6 mb-8'>
          {dataArray.map((item, index) => (
            <div key={index} className='flex flex-col items-center justify-center w-40 h-20 gap-1 bg-white border-gray-200 rounded-md shadow'>
              <b>{item.value.length}</b>
              <p className='text-slate-600'>{item.label}</p>
            </div>
          ))}
        </div>
        {/* Tabs */}
        <div className='inline-flex flex-wrap items-center p-1 bg-white border-gray-200 rounded-md shadow-sm'>
          {dataArray.map((tab) => (
            <button onClick={() => setCurrentTabs(tab.label)} key={tab.label} className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${currentTabs === tab.label ? 'bg-white font-medium text-black' : 'text-gray-500 hover:text-black'} cursor-pointer`}>
              <tab.icon className='w-4 h-4 mr-2' />
              <span className='ml-1'>{tab.label}</span>
              {tab.count !== undefined && (
                <span className='ml-2 text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full'>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
        {/* Connections List */}
        <div className='flex flex-wrap gap-6 mt-6'>
          {dataArray.find(item => item.label === currentTabs).value.map((user) => (
            <div key={user._id} className='flex w-full gap-5 p-6 bg-white rounded-md shadow max-w-88'>
              <img src={user.profile_picture} alt={user.name} className='w-12 h-12 mx-auto rounded-full shadow-md' />
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio.slice(0, 30)}...</p>
                <div className='flex gap-2 mt-4 max-sm:flex-col'>
                  {
                    <button onClick={() => navigate(`/profile/${user._id}`)} className='w-full p-2 text-sm text-white transition rounded cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95'>
                      View Profile
                    </button>
                  }
                  {
                    currentTabs === 'Following' && (
                      <button className='w-full p-2 text-sm text-black transition rounded cursor-pointer bg-slate-100 hover:bg-slate-200 active:scale-95'>
                        Unfollow
                      </button>
                    )
                  }
                  {
                    currentTabs === 'Pending' && (
                      <button className='w-full p-2 text-sm text-black transition rounded cursor-pointer bg-slate-100 hover:bg-slate-200 active:scale-95'>
                        Accept
                      </button>
                    )
                  }
                  {
                    currentTabs === 'Connections' && (
                      <button onClick={() => navigate(`/messages/${user._id}`)} className='flex items-center justify-center w-full gap-1 p-2 text-sm transition rounded cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95'>
                        <MessageSquare className='w-4 h-4' />
                        Message
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Connections
