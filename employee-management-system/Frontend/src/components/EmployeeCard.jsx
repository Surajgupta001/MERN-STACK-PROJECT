import { PencilIcon, Trash2Icon } from 'lucide-react'
import React, { useState } from 'react'

function EmployeeCard({ employee, onDelete, onEdit }) {
    const [showActions, setShowActions] = useState(false)

    const handleDelete = () => {
        if (!confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
            return;
        }
    }

    return (
        <div
            className='relative overflow-hidden group card card-hover'
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className='relative w-full overflow-hidden aspect-4/3 bg-linear-to-r from-slate-100 to-slate-50'>
                <div className='flex items-center justify-center w-full h-full'>
                    {/* Circle Icons */}
                    <div className='flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-r from-indigo-100 to-slate-100'>
                        <span className='text-2xl font-medium text-indigo-400'>{employee.firstName.charAt(0)}{employee.lastName.charAt(0)}</span>
                    </div>
                </div>
            </div>
            <div className='absolute flex gap-2 top-3 left-3'>
                <span className='bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-600 rounded-lg shadow-sm'>
                    {employee.department || 'Remote'}
                </span>
                {employee.isDeleted && <span className='bg-red-100 text-red-800 px-2.5 py-1 text-xs font-semibold rounded-lg shadow-sm'>Deleted</span>}
            </div>
            {!employee.isDeleted && showActions && (
                <div className='absolute inset-0 z-20 flex items-end justify-center gap-3 pb-6 bg-linear-to-t from-indigo-700/20 via-transparent to-transparent'>
                    <button onClick={() => onEdit(employee)} className='bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-slate-600 rounded-xl shadow-lg transition-all hover:scale-105'>
                        <PencilIcon className='w-4 h-4 cursor-pointer' />
                    </button>
                    <button onClick={handleDelete} className='bg-red-100 text-red-800 px-2.5 py-1 text-xs font-semibold rounded-xl shadow-lg transition-all hover:scale-105'>
                        <Trash2Icon className='w-4 h-4 cursor-pointer' />
                    </button>
                </div>
            )}
            <div className='p-5'>
                <h3 className='text-slate-900'>{employee.firstName} {employee.lastName}</h3>
                <p className='text-xs text-slate-500'>{employee.position}</p>
            </div>
        </div>
    )
}

export default EmployeeCard