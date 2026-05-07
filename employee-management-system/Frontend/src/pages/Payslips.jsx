import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading';
import PayslipList from '../components/payslips/PayslipList';
import GeneratePayslipsForm from '../components/payslips/GeneratePayslipsForm';
import { useAuth } from '../context/authContext';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

function Payslips() {

  const { user } = useAuth();

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const isAdmin = user?.role === 'ADMIN';

  const fetchPayslips = useCallback(async () => {
    try {
      const res = await api.get('/payslips');
      setPayslips(res.data.data || []);
    } catch (error) {
      console.error('Error fetching payslips:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to fetch payslips.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    if (isAdmin) {
      api.get('/employees').then((res) => setEmployee((res.data.result || []).filter((e) => !e.isDeleted))).catch((err) => toast.error(err.response?.data?.error || err.message || 'Failed to fetch employees.'));
    }
  }, [isAdmin]);

  if (loading) return <Loading />

  return (
    <div className='animate-fade-in'>
      <div className='flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center'>
        <div>
          <h1 className='page-title'>Payslips</h1>
          <p className='page-subtitle'>{isAdmin ? 'Generate and manage employee payslips' : 'Your payslips history'}</p>
        </div>
        {isAdmin && <GeneratePayslipsForm employees={employee} onSuccess={fetchPayslips} />}
      </div>
      <PayslipList payslips={payslips} isAdmin={isAdmin} />
    </div>
  )
}

export default Payslips