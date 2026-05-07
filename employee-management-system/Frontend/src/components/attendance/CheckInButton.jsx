import React, { useState } from 'react'
import { Loader2Icon, LogInIcon, LogOutIcon } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

function CheckInButton({ todayRecord, onAction }) {

    const [loading, setLoading] = useState(false);

    const handleAttendance = async () => {
        setLoading(true);
        try {
            await api.post('/attendance');
            onAction();
        } catch (error) {
            console.error('Error updating attendance:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to update attendance.');
        } 
        setLoading(false);
    };

    if (todayRecord?.checkOut) {
        return (
            <div className='flex flex-col items-center justify-center p-8 border bg-slate-50 rounded-2xl border-slate-100'>
                <h3 className='text-lg font-bold text-slate-900'>Work Day Completed</h3>
                <p className='mt-1 text-sm text-slate-500'>Great Job! See you tomorrow</p>
            </div>
        )
    }

    const isCheckedIn = !!todayRecord?.checkIn;

    return (
        <div className='absolute flex flex-col bottom-4 right-4 z-1'>
            <button className={`w-full max-w-xs flex justify-between items-center gap-8 p-4 rounded-xl bg-linear-to-br text-white ${isCheckedIn ? 'from-slate-700 to-slate-900' : 'from-indigo-500 to-indigo-700'} shadow-lg transition-all hover:scale-[1.02]`} onClick={handleAttendance} disabled={loading}>
                {loading ? <Loader2Icon className='size-7 animate-spin' /> : isCheckedIn ? <LogOutIcon className='size-7' /> : <LogInIcon className='size-7' />}
                <div className='relative flex flex-col items-center text-center'>
                    <h2 className='mb-1 text-lg font-medium'>{loading ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}</h2>
                    <p className='text-sm opacity-80'>{isCheckedIn ? 'Click to end your shift' : 'Start your work day'}</p>
                </div>
            </button>
        </div>
    )
}

export default CheckInButton