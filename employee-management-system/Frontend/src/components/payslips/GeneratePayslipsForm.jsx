import { Loader2, Plus, X } from 'lucide-react';
import React, { useState } from 'react'
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

function GeneratePayslipsForm({ employees, onSuccess }) {

    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className='flex items-center gap-2 btn-primary'>
                <Plus className='w-4 h-4' /> Generate Payslips
            </button>
        )
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.post('/payslips', data);
            setIsOpen(false);
            onSuccess();
            toast.success('Payslip generated successfully!');
        } catch (error) {
            console.error('Error generating payslip:', error);
            toast.error(error.response?.data?.error || error.message || 'Failed to generate payslip.');
        }
        setLoading(false);
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm'>
            <div className='w-full max-w-lg p-6 card animate-slide-up'>
                <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-lg font-bold text-slate-900'>Generate Monthly Payslips</h3>
                    <button onClick={() => setIsOpen(false)} className='p-1 text-slate-400 hover:text-slate-600'>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* Select employee */}
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Employee</label>
                        <select name='employeeId' required>
                            {employees.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.firstName} {e.lastName} {e.position}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Select month & year */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-slate-700'>Month</label>
                            <select name="month">
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='block mb-2 text-sm font-medium text-slate-700'>Year</label>
                            <input type='number' name='year' defaultValue={new Date().getFullYear()} required />
                        </div>
                    </div>
                    {/* Basic Salary */}
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Basic Salary</label>
                        <input type='number' name='basicSalary' placeholder='Enter basic salary' required />
                    </div>
                    {/* Allowance & Deductions */}
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Allowance</label>
                        <input type='number' name='allowance' defaultValue='0' />
                    </div>
                    <div>
                        <label className='block mb-2 text-sm font-medium text-slate-700'>Deductions</label>
                        <input type='number' name='deductions' defaultValue='0' />
                    </div>
                    {/* Buttons */}
                    <div className='flex justify-end gap-3 pt-2'>
                        <button type='button' onClick={() => setIsOpen(false)} className='btn-secondary'>
                            Cancel
                        </button>
                        <button type='submit' disabled={loading} className='flex items-center btn-primary'>
                            {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                            Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GeneratePayslipsForm