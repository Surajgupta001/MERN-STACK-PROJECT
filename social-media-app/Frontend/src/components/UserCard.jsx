import React from 'react'
import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { fetchUser } from '../features/user/userSlice';

function UserCard({ user }) {

    const currentUser = useSelector((state) => state.user.value);
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFollow = async () => {
        // Handle follow user logic
        try {
            const { data } = await api.post('/api/user/follow', { id: user._id }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                toast.success(data.message);
                dispatch(fetchUser(await getToken()));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleConnectionRequest = async () => {
        // Handle connection request logic
        if (currentUser?.connections?.includes(user._id)) {
            navigate(`/messages/${user._id}`);
            return;
        }
        try {
            const token = await getToken();
            const { data } = await api.post('/api/user/connect', { id: user._id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    return (
        <div key={user._id} className='flex flex-col justify-between p-4 pt-6 border border-gray-200 rounded-md shadow w-72'>
            <div className='text-center'>
                <img src={user.profile_picture} alt="" className='w-16 mx-auto rounded-full shadow-md' />
                <p className='mt-4 font-semibold'>{user.full_name}</p>
                {user.username && <p className='font-light text-gray-500'>@{user.username}</p>}
                {user.bio && <p className='px-4 mt-2 text-sm text-center text-gray-600'>{user.bio}</p>}
            </div>
            <div className='flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'>
                <div className='flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full'>
                    <MapPin className='w-4 h-4' />
                    {user.location}
                </div>
                <div className='flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full'>
                    <span>{user.followers.length}</span>
                    Followers
                </div>
            </div>
            <div className='flex gap-2 mt-4'>
                {/* Follow Button */}
                <button onClick={handleFollow} disabled={currentUser?.following.includes(user._id)} className='flex items-center justify-center w-full gap-2 py-2 text-white transition rounded-md cursor-pointer bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95'>
                    <UserPlus className='w-4 h-4' />
                    {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
                </button>
                {/* Connection Request Button / Message Button */}
                <button onClick={handleConnectionRequest} className='flex items-center justify-center w-16 transition border rounded-md cursor-pointer text-slate-500 group active:scale-95'>
                    {
                        currentUser?.connections.includes(user._id) ?
                            <MessageCircle className='w-5 h-5 transition group-hover:scale-105' />
                            :
                            <Plus className='w-5 h-5 transition group-hover:scale-105' />
                    }
                </button>
            </div>
        </div>
    )
}

export default UserCard
