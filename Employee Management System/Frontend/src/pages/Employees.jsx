import React, { useCallback, useEffect, useState } from 'react'
import { DEPARTMENTS, dummyEmployeeData } from '../assets/assets';
import { Plus, Search, X } from 'lucide-react';
import EmployeeCard from '../components/EmployeeCard';
import EmployeeForm from '../components/EmployeeForm';

function Employees() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setEmployees(dummyEmployeeData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = employees.filter((emp) => `${emp.firstName} ${emp.lastName} ${emp.position}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className='animate-fade-in'>
      {/* Header */}
      <div className='flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center'>
        <div>
          <h1 className='page-title'>Employees</h1>
          <p className='page-subtitle'>Manage your team members and their information.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className='flex items-center justify-center w-full gap-2 btn-primary sm:w-auto'>
          <Plus size={16} /> Add Employee
        </button>
      </div>
      {/* Search Bar */}
      <div className='flex flex-col gap-3 mb-6 sm:flex-row'>
        <div className='relative flex-1'>
          <Search className='absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none left-3 top-1/2 text-slate-400' aria-hidden="true" />
          <input
            placeholder='Search employees...'
            className='w-full py-2 pl-10 pr-3 border rounded-md bg-slate-100 placeholder:text-slate-400 border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className='max-w-xs px-3 py-2 border rounded-md'>
          <option value=''>All Departments</option>
          {DEPARTMENTS.map((deptName) => (
            <option key={deptName} value={deptName}>
              {deptName}
            </option>
          ))}
        </select>
      </div>
      {/* Employee Card */}
      {loading ? (
        <div className='flex justify-center p-12'>
          <div className='w-8 h-8 border-2 border-indigo-600 rounded-full animate-spin border-t-transparent' />
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4 sm:gap-5'>
          {filtered.length === 0 ? (
            <p className='py-16 text-center bg-white border border-dashed col-span-full text-slate-400 rounded-2xl border-slate-200'>No employees found.</p>
          ) : (
            filtered.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} onDelete={fetchEmployees} onEdit={(e) => setEditEmployee(e)} />
            ))
          )}
        </div>
      )}
      {/* Create Employee Modal */}
      {showCreateModal && (
        <div onClick={() => setShowCreateModal(false)} className='fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm'>
          <div className='fixed inset-0' />
          <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-3xl my-8 bg-white shadow-2xl rounded-2xl animate-fade-in'>
            <div className='flex items-center justify-between p-6 pb-0'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Add New Employee</h2>
                <p className='text-sm text-slate-500 mt-0.5'>Create a new user account and employee profile.</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className='p-2 transition-colors rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-6'>
              <EmployeeForm onSuccess={() => { setShowCreateModal(false); fetchEmployees(); }} onCancel={() => setShowCreateModal(false)} />
            </div>
          </div>
        </div>
      )}
      {/* Edit Employee Modal */}
      {editEmployee && (
        <div onClick={() => setEditEmployee(null)} className='fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm'>
          <div onClick={(e) => e.stopPropagation()} className='relative w-full max-w-3xl my-8 bg-white shadow-2xl rounded-2xl animate-fade-in'>
            <div className='flex items-center justify-between p-6 pb-0'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Edit Employee</h2>
                <p className='text-sm text-slate-500 mt-0.5'>Update employee information.</p>
              </div>
              <button onClick={() => setEditEmployee(null)} className='p-2 transition-colors rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <div className='p-6'>
              <EmployeeForm initialData={editEmployee} onSuccess={() => { setEditEmployee(null); fetchEmployees(); }} onCancel={() => setEditEmployee(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees