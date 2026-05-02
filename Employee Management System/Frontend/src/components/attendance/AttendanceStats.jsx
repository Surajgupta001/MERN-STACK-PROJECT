import { AlertCircleIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import React from 'react'

function AttendanceStats({ history }) {

    const totalPresent = history.filter((h) => h.status === 'PRESENT' | h.status === 'LATE').length;

    const totalLate = history.filter((h) => h.status === 'LATE').length;

    const stats = [
        { label: 'Days Present', value: totalPresent, icon: CalendarIcon },
        { label: 'Late Arrivals', value: totalLate, icon: AlertCircleIcon },
        { label: 'Avg. Work Hrs', value: '8.5 Hrs', icon: ClockIcon },
    ];

    return (
        <div className='grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3 sm:gap-5'>
            {stats.map((s) => (
                <div key={s.label} className='relative flex items-center gap-4 p-5 overflow-hidden card-hover sm:p-6 group'>
                    <div className='absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70' />
                    <div className='p-3 transition-colors duration-300 rounded-lg bg-slate-100 group-hover:bg-indigo-50'>
                        <s.icon className='w-5 h-5 transition-colors duration-300 text-slate-600 group-hover:text-indigo-600' />
                    </div>
                    <div>
                        <p className='text-sm text-slate-500'>{s.label}</p>
                        <p className='text-2xl font-medium tracking-tight text-slate-900'>{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AttendanceStats