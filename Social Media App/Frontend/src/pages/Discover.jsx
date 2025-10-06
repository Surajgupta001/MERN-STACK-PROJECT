import React, { useState } from 'react'
import { dummyConnectionsData } from '../assets/assets';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';

function Discover() {

  const [input, setInput] = useState('');
  const [users, setUsers] = useState(dummyConnectionsData);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setUsers([]);
      setLoading(true);
      setTimeout(() => {
        setUsers(dummyConnectionsData);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl p-6 mx-auto'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-slate-900'>Discover People</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your network</p>
        </div>
        {/* Search */}
        <div className='mb-8 border rounded-md shadow-md border-slate-200/16 bg-white/80'>
          <div className='p-6'>
            <div className='relative'>
              <Search className='absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400' />
              <input onChange={(e) => setInput(e.target.value)} value={input} onKeyUp={handleSearch} type='text' placeholder='Search people by name, username, bio, or location...' className='w-full py-2 pl-10 border border-gray-300 rounded-md sm:pl-12 max-sm:text-sm' />
            </div>
          </div>
        </div>
        <div className='flex flex-wrap gap-6'>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
        {loading && (<Loading height='60vh' />)}
      </div>
    </div>
  )
}

export default Discover
