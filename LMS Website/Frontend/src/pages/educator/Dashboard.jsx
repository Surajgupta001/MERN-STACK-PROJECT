import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

function Dashboard() {

  const { currency } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [])

  return dashboardData ? (
    <div className='flex flex-col items-start justify-between min-h-screen gap-8 pt-8 pb-0 md:p-8 md:pb-0'>
      <div className='space-y-5'>
        <div className='flex flex-wrap items-center gap-5'>
          <div className='flex items-center w-56 gap-3 p-4 border border-blue-500 rounded-md shadow-card'>
            <img src={assets.patients_icon} alt="patients icon" />
            <div>
              <p className='text-2xl font-medium text-gray-500'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-base text-gray-500'>Total Enrollments</p>
            </div>
          </div>
          <div className='flex items-center w-56 gap-3 p-4 border border-blue-500 rounded-md shadow-card'>
            <img src={assets.appointments_icon} alt="appointments icon" />
            <div>
              <p className='text-2xl font-medium text-gray-500'>{dashboardData.totalCourses}</p>
              <p className='text-base text-gray-500'>Total Appointments</p>
            </div>
          </div>
          <div className='flex items-center w-56 gap-3 p-4 border border-blue-500 rounded-md shadow-card'>
            <img src={assets.earning_icon} alt="earning icon" />
            <div>
              <p className='text-2xl font-medium text-gray-500'>{currency} {dashboardData.totalEarnings}</p>
              <p className='text-base text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className='pb-4 text-lg font-medium'>Latest Enrollments</h2>
          <div className='flex flex-col items-center w-full max-w-4xl overflow-hidden bg-white border rounded-md border-gray-500/20'>
          <table className='w-full overflow-hidden table-fixed md:table-auto'>
            <thead className='text-sm text-left text-gray-900 border-b border-r-gray-500/20'>
              <tr>
                <th className='hidden px-4 py-3 font-semibold text-center sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold'>Student Name</th>
                <th className='px-4 py-3 font-semibold'>Course Title</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className='border-b border-gray-500/20'>
                  <td className='hidden px-4 py-3 text-center sm:table-cell'>{index + 1}</td>
                    <td className='flex items-center px-2 py-3 space-x-3 md:px-4'>
                    <img className='rounded w-9 h-9-full' src={item.student.imageUrl} alt="profile" />
                    <span className='truncate'>{item.student.name}</span>
                    </td>
                    <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default Dashboard
