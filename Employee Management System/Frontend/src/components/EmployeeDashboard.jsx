import { ArrowRightIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

function EmployeeDashboard({ data }) {

    const emp = data.employee;

    const cards = [
        {
            icon: CalendarIcon,
            value: data.currentMonthAttendance,
            title: 'Days Present',
            subtitle: 'This month',
        },
        {
            icon: FileTextIcon,
            value: data.pendingLeaves,
            title: 'Pending Leaves',
            subtitle: 'Awaiting approval',
        },
        {
            icon: DollarSignIcon,
            value: data.latestPayslip ? `$${data.latestPayslip.netSalary?.toLocaleString()}` : 'N/A',
            title: 'Latest Payslip',
            subtitle: data.latestPayslip ? `Generated on ${new Date(data.latestPayslip.generatedAt).toLocaleDateString()}` : 'No payslip generated',
        }
    ]
    return (
        <div className='animate-fade-in'>
            <div className='page-header'>
                <h1 className='page-title'>Welcome, {emp?.firstName}!</h1>
                <p className='page-subtitle'>{emp?.position} - {emp?.department || 'No Department'}</p>
            </div>
            <div className='grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3 sm:gap-5'>
                {cards.map((card, index) => (
                    <div key={index} className='relative p-5 overflow-hidden sm:p-6 card card-hover group'>
                        <div className='absolute inset-y-0 left-0 w-1 rounded-r-full bg-slate-500/70' />
                        <div className='flex items-start justify-between gap-4 pl-2'>
                            <div className='min-w-0'>
                                <p className='text-sm font-medium text-slate-500'>{card.title}</p>
                                <p className='mt-1 text-2xl font-bold text-slate-900'>{card.value}</p>
                            </div>
                            <card.icon className='size-10 shrink-0 rounded-lg bg-slate-100 p-2.5 text-slate-600 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600' />
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
                <Link to='/attendance' className='inline-flex items-center justify-center gap-2 text-center btn-primary'>
                    Mark Attendance <ArrowRightIcon className='w-4 h-4' />
                </Link>
                <Link to='/leave' className='items-center btn-secondary'>
                    Apply for Leave
                </Link>
            </div>
        </div>
    )
}

export default EmployeeDashboard