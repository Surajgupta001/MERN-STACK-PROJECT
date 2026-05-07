import { Loader2, Save, User } from 'lucide-react';
import React, { useState } from 'react'
import api from '../api/axios';

function ProfileForm({ initialData, onSuccess }) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        const formData = new FormData(e.currentTarget);
        try {
            await api.post('/profile', formData);
            setMessage("Profile updated successfully!");
            onSuccess?.();
        } catch (error) {
            setError(error.response?.data?.error || error.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='p-5 mb-6 card sm:p-6'>
            <h2 className='flex items-center gap-2 pb-4 mb-6 text-base font-medium border-b text-slate-900 border-slate-100'>
                <User className='w-5 h-5 text-slate-400' /> Public Profile
            </h2>
            {error && (
                <div className='flex items-start gap-3 p-4 mb-6 text-sm border rounded-xl bg-rose-50 text-rose-700 border-rose-200'>
                    <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0' />
                    <span>{error}</span>
                </div>
            )}
            {message && (
                <div className='flex items-start gap-3 p-4 mb-6 text-sm border rounded-xl bg-emerald-50 text-emerald-700 border-emerald-200'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0' />
                    <span>{message}</span>
                </div>
            )}
            <div className='space-y-5'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Name</label>
                        <input disabled value={`${initialData.firstName} ${initialData.lastName}`} className='cursor-not-allowed bg-slate-50 text-slate-400' />
                    </div>
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Email</label>
                        <input disabled value={initialData.email} className='cursor-not-allowed bg-slate-50 text-slate-400' />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Position</label>
                        <input disabled value={initialData.position} className='cursor-not-allowed bg-slate-50 text-slate-400' />
                    </div>
                </div>
                <div>
                    <label className='block mb-2 text-sm font-medium text-slate-700'>Bio</label>
                    <textarea key={initialData.bio || ''} disabled={initialData.isDeleted} name='bio' defaultValue={initialData.bio || ''} placeholder='Write a brief bio...' className={`resize-none ${initialData.isDeleted ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`} />
                    <p className='text-xs text-slate-400 mt-1.5'>This will be displayed on your profile</p>
                </div>
                {initialData.isDeleted ? (
                    <div className='pt-2'>
                        <div className='p-4 text-center border bg-rose-50 border-rose-200 rounded-xl'>
                            <p className='font-medium tracking-tight text-rose-600'>Account Deactivated</p>
                            <p className='text-sm text-rose-500 mt-0.5'>You can no longer update your profile.</p>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-end pt-2'>
                        <button type='submit' disabled={loading} className='flex items-center justify-center w-full gap-2 btn-primary sm:w-auto'>
                            {loading ? <Loader2 className='w-4 h-4 animate-spin' /> : <Save className='w-4 h-4' />}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </form>
    )
}

export default ProfileForm