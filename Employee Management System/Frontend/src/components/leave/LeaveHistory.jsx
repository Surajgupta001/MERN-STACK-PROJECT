import { format } from 'date-fns';
import { Check, Loader2, X } from 'lucide-react';
import React, { useState } from 'react'

function LeaveHistory({ leaves, isAdmin, onUpdate }) {

    const [processing, setProcessing] = useState(null);

    const handleStatusUpdate = async (id, status) => {
        setProcessing(id);
        await onUpdate?.(id, status);
        setProcessing(null);
    };

    return (
        <div className='overflow-hidden card'>
            <div className='overflow-auto'>
                <table className='table-modern'>
                    <thead>
                        <tr>
                            {isAdmin && <th>Employee</th>}
                            <th>Type</th>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Status</th>
                            {isAdmin && <th className='text-center'>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 6 : 4} className='py-12 text-center text-slate-480'>
                                    No leave applications found.
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => {
                                const status = (leave.status || '').toUpperCase();
                                const recId = leave._id || leave.id;
                                return (
                                    <tr key={recId}>
                                        {isAdmin && (
                                            <td className=' text-slate-900'>{leave.employee?.firstName}</td>
                                        )}
                                        <td>
                                            <span className='badge bg-slate-100 text-slate-600'>{leave.type}</span>
                                        </td>
                                        <td className='text-xs text-slate-500'>
                                            {format(new Date(leave.startDate), 'MMM dd, yyyy')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className='max-w-xs truncate text-slate-500' title={leave.reason}>
                                            {leave.reason}
                                        </td>
                                        <td>
                                            <span className={`badge ${status === 'APPROVED' ? 'badge-success' : status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                                                {status || 'PENDING'}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                {status === 'PENDING' && (
                                                    <div className='flex justify-center gap-2'>
                                                        <button onClick={() => handleStatusUpdate(recId, 'APPROVED')} disabled={processing === recId} className='p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-50 transition-colors'>
                                                            {processing === recId ? <Loader2 className='w-4 h-4 animate-spin' /> : <Check className='w-4 h-4' />}
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(recId, 'REJECTED')} disabled={processing === recId} className='p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors'>
                                                            {processing === recId ? <Loader2 className='w-4 h-4 animate-spin' /> : <X className='w-4 h-4' />}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LeaveHistory