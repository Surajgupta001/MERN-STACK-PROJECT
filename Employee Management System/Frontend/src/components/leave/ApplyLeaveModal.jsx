import React, { useState } from 'react'
import { CalendarDays, FileText, Send, X } from 'lucide-react';

function ApplyLeaveModal({ open, onClose, onSuccess }) {

    const [loading, setLoading] = useState(false);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const mindate = today.toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    if (!open) return null;

    return (
        <div onClick={onClose} className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
            <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-lg bg-white shadow-2xl rounded-2xl animate-fade-in'>
                {/* Header */}
                <div className='flex items-center justify-between p-6 pb-0'>
                    <div>
                        <h2 className='text-lg font-semibold text-slate-800'>Apply for Leave</h2>
                        <p className='text-sm text-slate-400 mt-0.5'>Fill out the form below to apply for leave.</p>
                    </div>
                    <button onClick={onClose} className='p-2 transition-colors rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600'>
                        <X className='w-5 h-5' />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                    {/* Leave Type */}
                    <div>
                        <label className='flex items-center gap-2 mb-2 text-sm font-medium text-slate-700'>
                            <FileText className='w-4 h-4 text-slate-400' /> Leave Type
                        </label>
                        <select name="type" required>
                            <option value='SICK'>Sick Leave</option>
                            <option value='CASUAL'>Casual Leave</option>
                            <option value='ANNUAL'>Annual Leave</option>
                        </select>
                    </div>
                    {/* Duration */}
                    <div>
                        <label className='flex items-center gap-2 mb-2 text-sm font-medium text-slate-700'>
                            <CalendarDays className='w-4 h-4 text-slate-400' /> Duration
                        </label>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <span className='block mb-1 text-xs text-slate-400'>From</span>
                                <input type='date' name='startDate' required min={mindate} />
                            </div>
                            <div>
                                <span className='block mb-1 text-xs text-slate-400'>To</span>
                                <input type='date' name='endDate' required min={mindate} />
                            </div>
                        </div>
                    </div>
                    {/* Reason */}
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Reason</label>
                        <textarea name='reason' required rows={3} className='resize-none' placeholder='Briefly describe why you need this leave...' />
                    </div>
                    {/* Buttons */}
                    <div className='flex gap-3 pt-2'>
                        <button onClick={onClose} type='button' className='flex-1 btn-secondary'>
                            Cancel
                        </button>
                        <button onClick={onClose} disabled={loading} type='button' className='flex items-center justify-center flex-1 gap-2 btn-primary'>
                            {loading ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApplyLeaveModal