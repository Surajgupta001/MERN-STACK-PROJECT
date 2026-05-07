import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading';
import { PalmtreeIcon, PlusIcon, ThermometerIcon, UmbrellaIcon } from 'lucide-react';
import LeaveHistory from '../components/leave/LeaveHistory';
import ApplyLeaveModal from '../components/leave/ApplyLeaveModal';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

function Leave() {

  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const isAdmin = user?.role === 'ADMIN';

  const fectchLeaves = useCallback(async () => {
    try {
      const res = await api.get('/leave');
      setLeaves(res.data.data || []);
      if (res.data.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fectchLeaves();
  }, [fectchLeaves]);

  const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED');
  const sickCont = approvedLeaves.filter((l) => l.type === 'SICK').length;
  const casualCont = approvedLeaves.filter((l) => l.type === 'CASUAL').length;
  const annualCount = approvedLeaves.filter((l) => l.type === 'ANNUAL').length;

  const leaveStats = [
    { label: 'Sick', value: sickCont, icon: ThermometerIcon },
    { label: 'Casual', value: casualCont, icon: UmbrellaIcon },
    { label: 'Annual', value: annualCount, icon: PalmtreeIcon }
  ];

  if (loading) return <Loading />

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center'>
        <div>
          <h1 className='page-title'>Leave Management</h1>
          <p className='page-subtitle'>{isAdmin ? 'Manage leave application' : 'Your leave history and requests'}</p>
        </div>
        {!isAdmin && !isDeleted && (
          <button onClick={() => setShowModal(true)} className='flex items-center justify-center w-full gap-2 btn-primary sm:w-auto'>
            <PlusIcon className='w-4 h-4' /> Apply for Leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className='grid grid-cols-1 gap-4 mb-5 sm:grid-cols-3 sm:gap-5'>
          {leaveStats.map((s) => (
            <div key={s.label} className='relative flex items-center gap-4 p-5 overflow-hidden card card-hover sm:p-6 group'>
              <div className='absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70' />
              <div className='p-3 transition-colors duration-300 rounded-lg bg-slate-100 group-hover:bg-indigo-50'>
                <s.icon className='w-5 h-5 transition-colors duration-200 text-slate-600 group-hover:text-indigo-600' />
              </div>
              <div>
                <p className='text-sm text-slate-500'>{s.label}</p>
                <p className='text-2xl font-bold tracking-tight text-slate-900'>{s.value} <span className='text-sm font-normal text-slate-400'>taken</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
      <LeaveHistory leaves={leaves} isAdmin={isAdmin} onUpdate={fectchLeaves} />
      <ApplyLeaveModal open={showModal} onClose={() => setShowModal(false)} onSuccess={fectchLeaves} />
    </div>
  )
}

export default Leave