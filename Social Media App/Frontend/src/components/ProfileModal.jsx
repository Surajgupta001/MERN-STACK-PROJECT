import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react';

function ProfileModal({ setShowEdit }) {

    const user = dummyUserData;

    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name
    });

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        // Handle profile save logic here
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 h-screen overflow-y-scroll z-110 bg-black/50'>
            <div className='max-w-2xl mx-auto sm:py-6'>
                <div className='p-6 bg-white rounded-lg shadow-lg'>
                    <h1 className='mb-6 text-2xl font-bold text-gray-900'>Edit Profile</h1>
                    <form onSubmit={handleSaveProfile} className='space-y-4'>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="profile_picture" className='block mb-1 text-sm font-medium text-gray-700'>
                                Profile Picture
                                <input type="file" id="profile_picture" accept="image/*" onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} className='w-full p-3 border border-gray-200 rounded-lg' hidden />
                                <div className='relative group/cover'>
                                    <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="" className='object-cover w-24 h-24 mt-2 rounded-full' />
                                    <div className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden rounded-lg group-hover/cover:flex bg-black/20'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>
                        {/* Cover Photo */}
                        <div className='flex flex-col items-start gap-3'>
                            <label htmlFor="cover_photo" className='block mb-1 font-medium text-gray-700 texts-sm'>
                                Cover Photo
                                <input type="file" id="cover_photo" accept="image/*" onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} className='w-full p-3 border border-gray-200 rounded-lg' hidden />
                                <div className='relative group/cover'>
                                    <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className='object-cover h-40 mt-2 rounded-lg w-80 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200' />
                                    <div className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden rounded-lg group-hover/cover:flex bg-black/20'>
                                        <Pencil className='w-5 h-5 text-white' />
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>Name</label>
                            <input type="text" placeholder='Enter your name' value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>Username</label>
                            <input type="text" placeholder='Enter your username' value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>Bio</label>
                            <textarea placeholder='Enter your bio' value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' rows={3} />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>Location</label>
                            <input type="text" placeholder='Enter your location' value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className='w-full p-3 border border-gray-200 rounded-lg' />
                        </div>
                        <div className='flex justify-end pt-6 space-x-3'>
                            <button onClick={() => setShowEdit(false)} type='button' className='px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50'>Cancel</button>
                            <button type='submit' className='px-4 py-2 text-white transition rounded-lg cursor-pointer bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-purple-700'>Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal
