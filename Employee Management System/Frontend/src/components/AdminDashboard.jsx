import { Building2Icon, CalendarIcon, FileTextIcon, UserIcon } from 'lucide-react'
import React from 'react'

function AdminDashboard({ data }) {

    const stats = [
        {
            icon: UserIcon,
            value: data.totalEmployees,
            label: 'Total Employees',
            description: 'Active workforce',
        },
        {
            icon: Building2Icon,
            value: data.totalDepartments,
            label: 'Total Departments',
            description: 'Organizational units',
        },
        {
            icon: CalendarIcon,
            value: data.todayAttendance,
            label: 'Today\'s Attendance',
            description: 'Checked in today',
        },
        {
            icon: FileTextIcon,
            value: data.pendingLeaves,
            label: 'Pending Leaves',
            description: 'Awaiting approval',
        }
    ]

    return (
        <div className='animate-fade-in'>
            <div className='page-header'>
                <h1 className='page-title'>Dashboard</h1>
                <p className='page-subtitle'>Welcome back, Admin - here's your overview</p>
            </div>
            <div className='grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4'>
                {stats.map((s) => (
                    <div key={s.label} className='relative p-5 overflow-hidden sm:p-6 card card-hover group'>
                        <div className='absolute inset-y-0 left-0 w-1 rounded-r-full bg-slate-500/70' />
                        <div className='flex items-start justify-between gap-4 pl-2'>
                            <div className='min-w-0'>
                                <p className='text-sm font-medium text-slate-500'>{s.label}</p>
                                <p className='mt-1 text-2xl font-bold text-slate-900'>{s.value}</p>
                            </div>
                            <s.icon className='size-10 shrink-0 rounded-lg bg-slate-100 p-2.5 text-slate-600 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard