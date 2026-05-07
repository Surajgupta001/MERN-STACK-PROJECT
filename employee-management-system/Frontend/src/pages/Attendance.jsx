import React, { useCallback, useEffect, useState } from 'react'
import Loading from '../components/Loading';
import CheckInButton from '../components/attendance/CheckInButton';
import AttendanceStats from '../components/attendance/AttendanceStats';
import AttendanceHistory from '../components/attendance/AttendanceHistory';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

function Attendance() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get('/attendance');
      const json = response.data;
      setHistory(json.data || []);
      if (json.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />

  const today = new Date()
  today.setHours(0, 0, 0, 0);
  const todayHistory = history.find((r) => new Date(r.date).toDateString() === today.toDateString());

  return (
    <div className='animate-fade-in'>
      <div className='page-header'>
        <h1 className='page-title'>Attendance</h1>
        <p className='page-subtitle'>Track employee attendance and manage daily check-ins.</p>
      </div>
      {isDeleted ? (
        <div className='p-6 mb-8 text-center border bg-rose-50 border-rose-200 rounded-2xl'>
          <p className='text-rose-600'>You can no longer clock in or out because your employee record has been marked as deleted.</p>
        </div>
      ) : (
        <div className='mb-8'>
          <CheckInButton todayRecord={todayHistory} onAction={fetchData} />
        </div>
      )}
      <AttendanceStats history={history} />
      <AttendanceHistory history={history} />
    </div>
  )
}

export default Attendance