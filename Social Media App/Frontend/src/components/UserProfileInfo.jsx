import { Calendar, MapPin, PenBox, Verified } from 'lucide-react'
import React from 'react'
import moment from 'moment'

function UserProfileInfo({ user, posts, profileId, setShowEdit }) {
    return (
        <div className='relative px-6 py-4 bg-white md:px-8'>
            <div className='flex flex-col items-start gap-6 md:flex-row'>
                <div className='absolute w-32 h-32 border-4 border-white rounded-full shadow-lg -top-16'>
                    <img src={user.profile_picture} alt="" className='absolute rounded-full z-2' />
                </div>
                <div className='w-full pt-16 md:pt-0 md:pl-36'>
                    <div className='flex flex-col items-start justify-between md:flex-row'>
                        <div>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-2xl font-bold text-gray-900'>{user.full_name}</h1>
                                <Verified className='w-6 h-6 text-blue-500' />
                            </div>
                            <p className='text-gray-600'>{user.username ? `@${user.username}` : 'Add a username'}</p>
                        </div>
                        {/* If user is not others profile that means he is opening his profile so we will give edit button */}
                        {!profileId && (
                            <button onClick={() => setShowEdit(true)} className='flex items-center gap-2 px-4 py-2 mt-4 font-medium transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 md:mt-0'>
                                <PenBox className='w-4 h-4' />
                                Edit
                            </button>
                        )}
                    </div>
                    <p className='max-w-md mt-4 text-sm text-gray-700'>{user.bio}</p>
                    <div className='flex flex-wrap items-center mt-4 text-sm text-gray-500 gap-x-6 gap-y-2'>
                        <span className='flex items-center gap-1.5'>
                            <MapPin className='w-4 h-4' />
                            {user.location ? user.location : 'Add a location'}
                        </span>
                        <span className='flex items-center gap-1.5'>
                            <Calendar className='w-4 h-4' />
                            Joined
                            <span className='font-medium'>{moment(user.createdAt).fromNow()}</span>
                        </span>
                    </div>
                    <div className='flex items-center gap-6 pt-4 mt-6 border-t border-gray-200'>
                        <div>
                            <span className='font-bold text-gray-900 sm:text-xl'>{posts.length}</span>
                            <span className='ml-1.5 text-xs text-gray-500 sm:text-sm'>Posts</span>
                        </div>
                        <div>
                            <span className='font-bold text-gray-900 sm:text-xl'>{user.followers.length}</span>
                            <span className='ml-1.5 text-xs text-gray-500 sm:text-sm'>Followers</span>
                        </div>
                        <div>
                            <span className='font-bold text-gray-900 sm:text-xl'>{user.following.length}</span>
                            <span className='ml-1.5 text-xs text-gray-500 sm:text-sm'>Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileInfo
