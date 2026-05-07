import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEPARTMENTS } from '../assets/assets';
import { Loader2Icon } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

function EmployeeForm({ initialData, onSuccess, onCancel }) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        if (isEditMode) {
            const pwd = formData.get('password');
            if (!pwd) {
                formData.delete('password');
            }
        }

        try {
            const url = isEditMode ? `/employees/${initialData.id}` : '/employees';
            const method = isEditMode ? 'put' : 'post';
            await api[method](url, formData);
            onSuccess ? onSuccess() : navigate('/employees');
            toast.success(`Employee ${isEditMode ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.response?.data.error || error.message || 'Failed to submit form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='max-w-3xl space-y-6 animate-fade-in'>
            {/* Personal Information */}
            <div className='p-5 card sm:p-6'>
                <h3 className='pb-4 mb-6 font-medium border-b border-slate-100'>Personal Information</h3>
                <div className='grid grid-cols-1 gap-5 text-sm sm:grid-cols-2 text-slate-700'>
                    <div>
                        <label className='block mb-2'>First Name</label>
                        <input name='firstName' required defaultValue={initialData?.firstName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Last Name</label>
                        <input name='lastName' required defaultValue={initialData?.lastName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Phone Number</label>
                        <input name='phone' required defaultValue={initialData?.phone} />
                    </div>
                    <div>
                        <label className='block mb-2'>Join Date</label>
                        <input name='joinDate' type='date' required defaultValue={(initialData?.joinDate) ? new Date(initialData?.joinDate).toISOString().split('T')[0] : ''} />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Bio (Optional)</label>
                        <textarea className='resize-none' placeholder='Brief description...' name='bio' rows={3} defaultValue={initialData?.bio} />
                    </div>
                </div>
            </div>
            {/* Employment Details */}
            <div className='p-5 card sm:p-6'>
                <h3 className='pb-4 mb-6 text-base font-medium border-b text-slate-900 border-slate-100'>Employment Details</h3>
                <div className='grid grid-cols-1 gap-5 text-sm sm:grid-cols-2 text-slate-700'>
                    <div>
                        <label className='block mb-2'>Department</label>
                        <select name='department' defaultValue={initialData?.department || ''}>
                            <option value=''>Select Department</option>
                            {DEPARTMENTS.map((deptName) => (
                                <option key={deptName} value={deptName}>
                                    {deptName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block mb-2'>Position</label>
                        <input name='position' required defaultValue={initialData?.position} />
                    </div>
                    <div>
                        <label className='block mb-2'>Basic Salary</label>
                        <input name='basicSalary' step='0.01' min='0' type='number' required required defaultValue={initialData?.basicSalary || 0} />
                    </div>
                    <div>
                        <label className='block mb-2'>Allowances</label>
                        <input name='allowances' step='0.01' min='0' type='number' required defaultValue={initialData?.allowances || 0} />
                    </div>
                    <div>
                        <label className='block mb-2'>Deductions</label>
                        <input name='deductions' step='0.01' min='0' type='number' required defaultValue={initialData?.deductions || 0} />
                    </div>
                    {isEditMode && (
                        <div>
                            <label className='block mb-2'>Status</label>
                            <select name="employmentStatus" defaultValue={initialData?.employmentStatus}>
                                <option value='ACTIVE'>Active</option>
                                <option value='INACTIVE'>Inactive</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
            {/* Account Setup */}
            <div className='p-5 card sm:p-6'>
                <h3 className='pb-4 mb-6 text-base font-medium border-b text-slate-900 border-slate-100'>Account Setup</h3>
                <div className='grid grid-cols-1 gap-5 text-sm sm:grid-cols-2 text-slate-700'>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Work Email</label>
                        <input name='email' type='email' required defaultValue={initialData?.email} />
                    </div>
                    {!isEditMode && (
                        <div>
                            <label className='block mb-2'>Temporary Password</label>
                            <input name='password' type='password' required />
                        </div>
                    )}
                    {isEditMode && (
                        <div>
                            <label className='block mb-2'>Change Password (Optional)</label>
                            <input name='password' placeholder='Leave blank to keep current password' type='password' />
                        </div>
                    )}
                    <div>
                        <label className='block mb-2'>System Role</label>
                        <select name='role' defaultValue={initialData?.user?.role || 'EMPLOYEE'}>
                            <option value='EMPLOYEE'>Employee</option>
                            <option value='ADMIN'>Admin</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* Buttons */}
            <div className='flex flex-col-reverse justify-end gap-3 pt-2 sm:flex-row'>
                <button onClick={() => (onCancel ? onCancel() : navigate(-1))} type='button' className='cursor-pointer btn-secondary'>Cancel</button>
                <button type='submit' disabled={loading} className='flex items-center justify-center cursor-pointer btn-primary'>
                    {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                    {isEditMode ? 'Update Employee' : 'Create Employee'}
                </button>
            </div>
        </form>
    )
}

export default EmployeeForm