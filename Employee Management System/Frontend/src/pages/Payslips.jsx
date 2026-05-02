import React, { useCallback, useEffect, useState } from 'react'
import { dummyEmployeeData, dummyPayslipData } from '../assets/assets';
import Loading from '../components/Loading';
import PayslipList from '../components/payslips/PayslipList';
import GeneratePayslipsForm from '../components/payslips/GeneratePayslipsForm';

function Payslips() {

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState([]);
  const isAdmin = true;

  const fetchPayslips = useCallback(async () => {
    setPayslips(dummyPayslipData);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  useEffect(() => {
    if (isAdmin) {
      setEmployee(dummyEmployeeData);
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